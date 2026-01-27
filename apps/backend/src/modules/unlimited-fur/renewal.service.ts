import { prisma } from '../../shared/lib/prisma.js';

/**
 * Background service for processing subscription renewals
 */
export class RenewalService {
    /**
     * Process all plans due for renewal today
     */
    async processRenewals() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const plansToRenew = await prisma.monthlyPlan.findMany({
            where: {
                planStatus: 'active',
                nextBillingDate: { lte: today },
            },
            include: {
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
            } catch (error: any) {
                results.push({ planId: plan.id, success: false, error: error?.message || 'Unknown renewal error' });
                console.error(`Failed to renew plan ${plan.id}:`, error);
            }
        }

        return results;
    }

    /**
     * Renew a single plan (Transactional)
     */
    async renewPlan(plan: any) {
        // 1. Validate stock availability for all plan items
        for (const product of plan.products) {
            if (product.variant.stock < product.quantity) {
                throw new Error(`Insufficient stock for ${product.product.name}`);
            }
        }

        const subtotal = plan.products.reduce((sum: number, p: any) => sum + (p.lockedPrice * p.quantity), 0);
        const cycleNumber = (plan.orders[0]?.cycleNumber || 0) + 1;
        const orderNumber = `SUBRP${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        // 2. Fetch user's default address for renewal
        const address = await prisma.address.findFirst({
            where: { userId: plan.userId, isDefault: true },
        });

        if (!address) {
            throw new Error('User has no default address for renewal');
        }

        // 3. Execute Transaction for Renewal
        return await prisma.$transaction(async (tx) => {
            // Create the renewal order
            const order = await tx.order.create({
                data: {
                    userId: plan.userId,
                    orderNumber,
                    subtotal,
                    total: subtotal,
                    paymentMethod: 'auto_renewal',
                    shippingAddress: address as any,
                    items: {
                        create: plan.products.map((p: any) => ({
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

            // Track the cycle
            await tx.monthlyPlanOrder.create({
                data: {
                    planId: plan.id,
                    orderId: order.id,
                    cycleNumber,
                    cycleMonth: new Date(),
                    budgetUsed: subtotal,
                    budgetRemaining: plan.monthlyBudget - subtotal,
                    productsSnapshot: plan.products as any,
                    status: 'confirmed',
                    autoConfirmed: true,
                },
            });

            // Calculate and update next billing date
            const nextDate = new Date(plan.nextBillingDate);
            nextDate.setMonth(nextDate.getMonth() + 1);

            await tx.monthlyPlan.update({
                where: { id: plan.id },
                data: { nextBillingDate: nextDate },
            });

            // Decrement stock levels
            for (const product of plan.products) {
                await tx.productVariant.update({
                    where: { id: product.variantId },
                    data: { stock: { decrement: product.quantity } },
                });
            }

            return { orderId: order.id, orderNumber, cycleNumber };
        });
    }
}
