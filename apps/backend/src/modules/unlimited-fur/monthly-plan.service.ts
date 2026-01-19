import { prisma } from '../../shared/lib/prisma.js';
import { WalletState } from './types';
import { NotFoundError, BadRequestError } from '../../shared/errors';


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
    if (!plan) throw new NotFoundError('Plan not found');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { monthlyBudget },
    });
  }

  async updatePetProfile(planId: string, userId: string, petType: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
    });
    if (!plan) throw new NotFoundError('Plan not found');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { petType },
    });
  }

  async updateCategories(planId: string, userId: string, selectedCategories: string[]) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
    });
    if (!plan) throw new NotFoundError('Plan not found');

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
    if (!plan) throw new NotFoundError('Plan not found');

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });
    if (!variant) throw new NotFoundError('Variant not found');

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
    if (!plan) throw new NotFoundError('Plan not found');

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
    if (!plan) throw new NotFoundError('Plan not found');

    const spent = plan.products.reduce((sum, p) => sum + (p.lockedPrice * p.quantity), 0);
    const remaining = plan.monthlyBudget - spent;

    return {
      monthlyBudget: plan.monthlyBudget,
      spent,
      remaining,
      canAddMore: remaining > 0,
    };
  }

  async activatePlan(planId: string, userId: string, addressId: string, paymentMethod: string, billingCycleDay: number) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
      include: { products: { include: { product: true, variant: true } } },
    });
    if (!plan) throw new NotFoundError('Plan not found');
    if (plan.products.length === 0) throw new BadRequestError('No products selected');

    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw new NotFoundError('Address not found');

    const wallet = await this.calculateWallet(planId, userId);
    const nextBillingDate = new Date();
    nextBillingDate.setDate(billingCycleDay);
    if (nextBillingDate <= new Date()) {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    const orderNumber = `ORD${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal: wallet.spent,
        total: wallet.spent,
        paymentMethod,
        shippingAddress: address,
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

    await prisma.monthlyPlanOrder.create({
      data: {
        planId,
        orderId: order.id,
        cycleNumber: 1,
        cycleMonth: new Date(),
        budgetUsed: wallet.spent,
        budgetRemaining: wallet.remaining,
        productsSnapshot: plan.products,
        status: 'confirmed',
      },
    });

    await prisma.monthlyPlan.update({
      where: { id: planId },
      data: {
        planStatus: 'active',
        billingCycleDay,
        nextBillingDate,
        activatedAt: new Date(),
      },
    });

    return { order, plan };
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
    if (!plan) throw new NotFoundError('Plan not found');

    await prisma.monthlyPlanProduct.deleteMany({ where: { planId } });

    for (const p of products) {
      const variant = await prisma.productVariant.findUnique({ where: { id: p.variantId } });
      if (variant) {
        await prisma.monthlyPlanProduct.create({
          data: {
            planId,
            productId: p.productId,
            variantId: p.variantId,
            quantity: p.quantity,
            lockedPrice: variant.price,
          },
        });
      }
    }

    return await this.getActivePlan(userId);
  }

  async pausePlan(planId: string, userId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'active' },
    });
    if (!plan) throw new NotFoundError('Plan not found');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { planStatus: 'paused', pausedAt: new Date() },
    });
  }

  async cancelPlan(planId: string, userId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId },
    });
    if (!plan) throw new NotFoundError('Plan not found');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { planStatus: 'cancelled' },
    });
  }
}
