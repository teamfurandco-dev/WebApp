import { prisma } from '../../shared/lib/prisma.js';


export class RenewalService {
  async processRenewals() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plansToRenew = await prisma.monthlyPlan.findMany({
      where: {
        planStatus: 'active',
        nextBillingDate: { lte: today },
      },
      include: {
        user: true,
        products: {
          include: {
            product: true,
            variant: true,
          },
        },
        orders: {
          orderBy: { cycleNumber: 'desc' },
          take: 1,
        },
      },
    });

    const results = [];

    for (const plan of plansToRenew) {
      try {
        const result = await this.renewPlan(plan);
        results.push({ planId: plan.id, success: true, result });
      } catch (error) {
        results.push({ planId: plan.id, success: false, error: error.message });
        console.error(`Failed to renew plan ${plan.id}:`, error);
      }
    }

    return results;
  }

  async renewPlan(plan: any) {
    // Validate stock availability
    for (const product of plan.products) {
      if (product.variant.stock < product.quantity) {
        throw new Error(`Insufficient stock for ${product.product.name}`);
      }
    }

    // Calculate totals
    const subtotal = plan.products.reduce((sum, p) => sum + (p.lockedPrice * p.quantity), 0);
    const cycleNumber = (plan.orders[0]?.cycleNumber || 0) + 1;

    // Generate order number
    const orderNumber = `ORD${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Get default address
    const address = await prisma.address.findFirst({
      where: { userId: plan.userId, isDefault: true },
    });

    if (!address) {
      throw new Error('No default address found');
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: plan.userId,
        orderNumber,
        subtotal,
        total: subtotal,
        paymentMethod: 'auto',
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

    // Create monthly plan order
    await prisma.monthlyPlanOrder.create({
      data: {
        planId: plan.id,
        orderId: order.id,
        cycleNumber,
        cycleMonth: new Date(),
        budgetUsed: subtotal,
        budgetRemaining: plan.monthlyBudget - subtotal,
        productsSnapshot: plan.products,
        status: 'confirmed',
        autoConfirmed: true,
      },
    });

    // Update next billing date
    const nextBillingDate = new Date(plan.nextBillingDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    await prisma.monthlyPlan.update({
      where: { id: plan.id },
      data: { nextBillingDate },
    });

    // Reduce stock
    for (const product of plan.products) {
      await prisma.productVariant.update({
        where: { id: product.variantId },
        data: { stock: { decrement: product.quantity } },
      });
    }

    return { orderId: order.id, orderNumber, cycleNumber };
  }
}
