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
    // 1. Try to find an existing MonthlyPlan draft
    let plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'draft' },
      include: { products: { include: { product: true, variant: true } } },
    });

    // 2. Fallback to UnlimitedFurDraft (Optimized flow)
    if (!plan) {
      const draft = await prisma.unlimitedFurDraft.findFirst({
        where: { id: planId, userId, mode: 'monthly' },
        include: { products: { include: { variant: { include: { product: true } } } } }
      });

      if (!draft) throw new NotFoundError('Plan');

      // Convert UnlimitedFurDraft to a MonthlyPlan
      plan = await prisma.monthlyPlan.create({
        data: {
          userId,
          monthlyBudget: draft.budget,
          petType: draft.petType,
          selectedCategories: [], // Optional: can be derived if needed
          planStatus: 'draft',
          products: {
            create: draft.products.map(p => ({
              productId: p.productId,
              variantId: p.variantId,
              quantity: p.quantity,
              lockedPrice: p.lockedPrice
            }))
          }
        },
        include: { products: { include: { product: true, variant: true } } }
      });

      // Cleanup the temporary draft
      await prisma.unlimitedFurDraft.update({
        where: { id: planId },
        data: { status: 'completed' }
      });
    }

    if (plan.products.length === 0) throw new BadRequestError('Plan must have products to activate');
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Shipping address');

    const subtotal = plan.products.reduce((sum, p) => sum + (p.lockedPrice * p.quantity), 0);
    const remaining = plan.monthlyBudget - subtotal;
    const nextBillingDate = this.calculateNextBillingDate(billingCycleDay);
    const orderNumber = await this.generateOrderNumber();

    return await prisma.$transaction(async (tx) => {
      // 1. Create the initial order for the first cycle
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          subtotal,
          total: subtotal,
          paymentMethod,
          shippingAddress: address as any,
          items: {
            create: plan!.products.map(p => ({
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
          planId: plan!.id,
          orderId: order.id,
          cycleNumber: 1,
          cycleMonth: new Date(),
          budgetUsed: subtotal,
          budgetRemaining: remaining,
          productsSnapshot: plan!.products as any,
          status: 'confirmed',
        },
      });

      // 3. Update the plan status
      const updatedPlan = await tx.monthlyPlan.update({
        where: { id: plan!.id },
        data: {
          planStatus: 'active',
          billingCycleDay,
          nextBillingDate,
          activatedAt: new Date(),
        },
      });

      // 4. Reduce stock for the first cycle
      for (const p of plan!.products) {
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
      where: {
        userId,
        planStatus: { in: ['active', 'paused'] }
      },
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
    if (!plan) throw new NotFoundError('Active Plan');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { planStatus: 'paused', pausedAt: new Date() },
    });
  }

  async resumePlan(planId: string, userId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'paused' },
    });
    if (!plan) throw new NotFoundError('Paused Plan');

    return await prisma.monthlyPlan.update({
      where: { id: planId },
      data: { planStatus: 'active' },
    });
  }

  async skipMonth(planId: string, userId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId, planStatus: 'active' },
      include: {
        products: true,
        orders: {
          orderBy: { cycleNumber: 'desc' },
          take: 1,
        },
      },
    });
    if (!plan) throw new NotFoundError('Active Plan');
    if (!plan.nextBillingDate) throw new BadRequestError('Plan has no billing date');

    const subtotal = plan.products.reduce((sum, p) => sum + (p.lockedPrice * p.quantity), 0);
    const cycleNumber = (plan.orders[0]?.cycleNumber || 0) + 1;
    const nextDate = new Date(plan.nextBillingDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    return await prisma.$transaction(async (tx) => {
      // 1. Create a dummy/skipped order reference if needed, or just the tracking record
      // For skipping, we don't create a real Order, but we track it in MonthlyPlanOrder
      await tx.monthlyPlanOrder.create({
        data: {
          planId,
          cycleNumber,
          cycleMonth: new Date(),
          budgetUsed: 0,
          budgetRemaining: plan.monthlyBudget,
          productsSnapshot: plan.products as any,
          status: 'skipped',
          autoConfirmed: true,
        },
      });

      // 2. Update the next billing date
      return await tx.monthlyPlan.update({
        where: { id: planId },
        data: { nextBillingDate: nextDate },
        include: { products: { include: { product: true, variant: true } } },
      });
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

  async adminGetAllSubscriptions() {
    return await prisma.monthlyPlan.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true }
        },
        products: {
          include: { product: true, variant: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async adminGetSubscriptionById(id: string) {
    return await prisma.monthlyPlan.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        },
        products: {
          include: { product: true, variant: true }
        },
        orders: {
          include: { order: true },
          orderBy: { cycleNumber: 'desc' }
        }
      }
    });
  }

  async createDraftFromPlan(planId: string, userId: string) {
    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId },
      include: { products: { include: { variant: true } } }
    });
    if (!plan) throw new NotFoundError('Plan');

    // Create Draft
    return await prisma.bundleDraft.create({
      data: {
        userId,
        bundleBudget: plan.monthlyBudget,
        petType: plan.petType,
        selectedCategories: plan.selectedCategories,
        products: {
          create: plan.products.map(p => ({
            productId: p.productId,
            variantId: p.variantId,
            quantity: p.quantity,
            price: p.variant.price // Use current price for draft
          }))
        }
      },
      include: { products: true }
    });
  }

  async updatePlanFromDraft(planId: string, draftId: string, userId: string) {
    const draft = await prisma.bundleDraft.findUnique({
      where: { id: draftId, userId },
      include: { products: true }
    });
    if (!draft) throw new NotFoundError('Draft');

    const plan = await prisma.monthlyPlan.findFirst({
      where: { id: planId, userId }
    });
    if (!plan) throw new NotFoundError('Plan');

    return await prisma.$transaction(async (tx) => {
      // 1. Update Plan Details
      await tx.monthlyPlan.update({
        where: { id: planId },
        data: {
          monthlyBudget: draft.bundleBudget,
          petType: draft.petType || plan.petType,
          selectedCategories: draft.selectedCategories
        }
      });

      // 2. Delete old products
      await tx.monthlyPlanProduct.deleteMany({
        where: { planId }
      });

      // 3. Insert new products
      for (const p of draft.products) {
        await tx.monthlyPlanProduct.create({
          data: {
            planId,
            productId: p.productId,
            variantId: p.variantId,
            quantity: p.quantity,
            lockedPrice: p.price
          }
        });
      }

      // 4. Delete Draft
      await tx.bundleDraft.delete({ where: { id: draftId } });

      return await tx.monthlyPlan.findUnique({
        where: { id: planId },
        include: { products: { include: { product: true, variant: true } } }
      });
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
