import { prisma } from '../../shared/lib/prisma.js';
import { WalletState } from './types.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';


export class MonthlyPlanService {
  async createDraft(userId: string) {
    const plan = await prisma.monthlyPlan.create({
      data: {
        userId,
        monthlyBudget: 0,
        petType: '',
        selectedCategories: [],
        planStatus: 'draft',
      },
    });
    return plan;
  }

  async updateBudget(planId: string, userId: string, monthlyBudget: number) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
    });
    if (!plan) throw new NotFoundError('Plan');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { monthlyBudget },
    });
  }

  async updatePetProfile(planId: string, userId: string, petType: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
    });
    if (!plan) throw new NotFoundError('Plan');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { petType },
    });
  }

  async updateCategories(planId: string, userId: string, selectedCategories: string[]) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
    });
    if (!plan) throw new NotFoundError('Plan');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { selectedCategories },
    });
  }

  async addProduct(planId: string, userId: string, productId: string, variantId: string, quantity: number) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId },
      include: { products: true },
    });
    if (!plan) throw new NotFoundError('Plan');

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });
    if (!variant) throw new NotFoundError('Variant');

    const wallet = await this.calculateWallet(planId, userId);
    const totalCost = variant.price * quantity;

    if (wallet.remaining < totalCost) {
      throw new BadRequestError('Exceeds budget');
    }

    const existing = await prisma.monthlyPlanProduct.findFirst({
      where: { planId, productId, variantId },
    });

    if (existing) {
      return await prisma.monthlyPlanProduct.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return await prisma.monthlyPlanProduct.create({
      data: {
        planId,
        productId,
        variantId,
        quantity,
        lockedPrice: variant.price,
      },
    });
  }

  async removeProduct(planId: string, userId: string, productId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId },
    });
    if (!plan) throw new NotFoundError('Plan');

    await prisma.monthlyPlanProduct.deleteMany({
      where: { planId, productId },
    });

    return { success: true };
  }

  async calculateWallet(planId: string, userId: string): Promise<WalletState> {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId },
      include: { products: true },
    });
    if (!plan) throw new NotFoundError('Plan');

    const spent = plan.products.reduce((sum, p) => sum + (p.lockedPrice * p.quantity), 0);
    const remaining = plan.monthlyBudget - spent;

    return {
      monthlyBudget: plan.monthlyBudget,
      spent,
      remaining,
      canAddMore: remaining > 0,
    };
  }

  /**
   * Activate the monthly plan (Transactional)
   */
  async activatePlan(planId: string, userId: string, addressId: string, paymentMethod: string, billingCycleDay: number) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
      include: { products: { include: { product: true, variant: true } } },
    });

    if (!plan) throw new NotFoundError('Plan');
    if (plan.products.length === 0) throw new BadRequestError('Plan must have products to activate');

    const address = await prisma.address.findUnique({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Shipping address');

    const wallet = await this.calculateWallet(planId, userId);
    const nextBillingDate = this.calculateNextBillingDate(billingCycleDay);

    const orderNumber = await this.generateOrderNumber();

    return await prisma.$transaction(async (tx) => {
      // 1. Create the initial order for the first cycle
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          subtotal: wallet.spent,
          total: wallet.spent,
          paymentMethod,
          shippingAddress: address as any,
          items: {
            create: plan.products.map(p => ({
              productId: p.productId,
              variantId: p.variantId,
              productName: p.product.name,
              variantName: p.variant.name,
              sku: p.variant.sku,
              quantity: p.quantity,
              price: p.lockedPrice,
              total: p.lockedPrice * p.quantity,
            })),
          },
        },
      });

      // 2. Create the plan order tracking record
      await tx.monthlyPlanOrder.create({
        data: {
          planId,
          orderId: order.id,
          cycleNumber: 1,
          cycleMonth: new Date(),
          budgetUsed: wallet.spent,
          budgetRemaining: wallet.remaining,
          productsSnapshot: plan.products as any,
          status: 'confirmed',
        },
      });

      // 3. Update the plan status
      const updatedPlan = await tx.monthlyPlan.update({
        where: { id: planId },
        data: {
          planStatus: 'active',
          billingCycleDay,
          nextBillingDate,
          activatedAt: new Date(),
        },
      });

      // 4. Reduce stock for the first cycle
      for (const p of plan.products) {
        await tx.productVariant.update({
          where: { id: p.variantId },
          data: { stock: { decrement: p.quantity } }
        });
      }

      return { order, plan: updatedPlan };
    });
  }

  async getActivePlan(userId: string) {
    return await prisma.monthlyPlan.findFirst({
      where: { userId, planStatus: 'active' },
      include: {
        products: {
          include: { product: true, variant: true },
        },
      },
    });
  }

  async editPlan(planId: string, userId: string, products: Array<{ productId: string; variantId: string; quantity: number }>) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'active' },
    });
    if (!plan) throw new NotFoundError('Plan');

    // Simple replacement for now - can be optimized
    return await prisma.$transaction(async (tx) => {
      await tx.monthlyPlanProduct.deleteMany({ where: { planId } });

      for (const p of products) {
        const variant = await tx.productVariant.findUnique({ where: { id: p.variantId } });
        if (!variant) throw new NotFoundError(`Variant ${p.variantId}`);

        await tx.monthlyPlanProduct.create({
          data: {
            planId,
            productId: p.productId,
            variantId: p.variantId,
            quantity: p.quantity,
            lockedPrice: variant.price,
          },
        });
      }

      return await tx.monthlyPlan.findUnique({
        where: { id: planId },
        include: { products: { include: { product: true, variant: true } } },
      });
    });
  }

  async pausePlan(planId: string, userId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'active' },
    });
    if (!plan) throw new NotFoundError('Plan');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { planStatus: 'paused', pausedAt: new Date() },
    });
  }

  async cancelPlan(planId: string, userId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId },
    });
    if (!plan) throw new NotFoundError('Plan');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { planStatus: 'cancelled' },
    });
  }

  private calculateNextBillingDate(day: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(day);
    date.setHours(6, 0, 0, 0); // Default to cycle start morning
    return date;
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const count = await prisma.order.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `SUB${year}${month}${day}${sequence}`;
  }
}
