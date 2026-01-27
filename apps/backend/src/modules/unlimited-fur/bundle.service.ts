import { prisma } from '../../shared/lib/prisma.js';
import { WalletState } from './types.js';
import { BUNDLE_MIN_PRODUCTS, BUNDLE_DISCOUNT_RATE } from './constants.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';

export class BundleService {
  /**
   * Create a new bundle draft in the database
   */
  async createDraft(userId: string) {
    const bundle = await prisma.bundleDraft.create({
      data: {
        userId,
        bundleBudget: 0,
        selectedCategories: [],
      },
    });
    return { id: bundle.id };
  }

  /**
   * Update the budget for a bundle draft
   */
  async updateBudget(bundleId: string, userId: string, bundleBudget: number) {
    const bundle = await prisma.bundleDraft.findFirst({
      where: { id: bundleId, userId },
    });
    if (!bundle) throw new NotFoundError('Bundle');

    return await prisma.bundleDraft.update({
      where: { id: bundleId },
      data: { bundleBudget },
      include: { products: true }
    });
  }

  /**
   * Update the pet profile for a bundle draft
   */
  async updatePetProfile(bundleId: string, userId: string, petType: string) {
    const bundle = await prisma.bundleDraft.findFirst({
      where: { id: bundleId, userId },
    });
    if (!bundle) throw new NotFoundError('Bundle');

    return await prisma.bundleDraft.update({
      where: { id: bundleId },
      data: { petType },
      include: { products: true }
    });
  }

  /**
   * Update the categories for a bundle draft
   */
  async updateCategories(bundleId: string, userId: string, selectedCategories: string[]) {
    const bundle = await prisma.bundleDraft.findFirst({
      where: { id: bundleId, userId },
    });
    if (!bundle) throw new NotFoundError('Bundle');

    return await prisma.bundleDraft.update({
      where: { id: bundleId },
      data: { selectedCategories },
      include: { products: true }
    });
  }

  /**
   * Add a product variant to the bundle draft
   */
  async addProduct(bundleId: string, userId: string, productId: string, variantId: string, quantity: number) {
    const bundle = await prisma.bundleDraft.findFirst({
      where: { id: bundleId, userId },
      include: { products: true }
    });
    if (!bundle) throw new NotFoundError('Bundle');

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true }
    });
    if (!variant) throw new NotFoundError('Variant');

    const wallet = await this.calculateWallet(bundleId, userId);
    const totalCost = variant.price * quantity;

    if (wallet.remaining < totalCost) {
      throw new BadRequestError('Exceeds budget');
    }

    const existing = await prisma.bundleDraftProduct.findFirst({
      where: { bundleId, variantId }
    });

    if (existing) {
      await prisma.bundleDraftProduct.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
    } else {
      await prisma.bundleDraftProduct.create({
        data: {
          bundleId,
          productId,
          variantId,
          quantity,
          price: variant.price
        }
      });
    }

    return await prisma.bundleDraft.findUnique({
      where: { id: bundleId },
      include: { products: true }
    });
  }

  /**
   * Remove a product from the bundle draft
   */
  async removeProduct(bundleId: string, userId: string, productId: string) {
    const bundle = await prisma.bundleDraft.findFirst({
      where: { id: bundleId, userId },
    });
    if (!bundle) throw new NotFoundError('Bundle');

    await prisma.bundleDraftProduct.deleteMany({
      where: { bundleId, productId }
    });

    return { success: true };
  }

  /**
   * Calculate current wallet state for the bundle
   */
  async calculateWallet(bundleId: string, userId: string): Promise<WalletState> {
    const bundle = await prisma.bundleDraft.findFirst({
      where: { id: bundleId, userId },
      include: { products: true }
    });
    if (!bundle) throw new NotFoundError('Bundle');

    const spent = bundle.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const remaining = bundle.bundleBudget - spent;

    return {
      monthlyBudget: bundle.bundleBudget,
      spent,
      remaining,
      canAddMore: remaining > 0,
    };
  }

  /**
   * Calculate bundle discount
   */
  calculateDiscount(products: any[]): number {
    if (products.length < BUNDLE_MIN_PRODUCTS) return 0;

    const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return Math.floor(subtotal * BUNDLE_DISCOUNT_RATE);
  }

  /**
   * Checkout the bundle and create an order
   */
  async checkout(bundleId: string, userId: string, addressId: string, paymentMethod: string) {
    const bundle = await prisma.bundleDraft.findFirst({
      where: { id: bundleId, userId },
      include: { products: true }
    });

    if (!bundle) throw new NotFoundError('Bundle');
    if (bundle.products.length === 0) throw new BadRequestError('No products selected');

    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw new NotFoundError('Address');

    const subtotal = bundle.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const discount = this.calculateDiscount(bundle.products);
    const total = subtotal - discount;

    const orderNumber = await this.generateOrderNumber();

    const productDetails = await Promise.all(
      bundle.products.map(async p => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: p.variantId },
          include: { product: true },
        });
        return { ...p, variant };
      })
    );

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          subtotal,
          discount,
          total,
          paymentMethod,
          shippingAddress: address as any,
          items: {
            create: productDetails.map(p => ({
              productId: p.productId,
              variantId: p.variantId,
              productName: p.variant!.product.name,
              variantName: p.variant!.name,
              sku: p.variant!.sku,
              quantity: p.quantity,
              price: p.price,
              total: p.price * p.quantity,
            })),
          },
        },
      });

      await tx.oneTimeBundleOrder.create({
        data: {
          orderId: order.id,
          bundleBudget: bundle.bundleBudget,
          petType: bundle.petType || 'unknown',
          selectedCategories: bundle.selectedCategories,
          discountApplied: discount,
        },
      });

      // Reduce stock
      for (const p of productDetails) {
        await tx.productVariant.update({
          where: { id: p.variantId },
          data: { stock: { decrement: p.quantity } }
        });
      }

      // Clear the draft
      await tx.bundleDraft.delete({ where: { id: bundleId } });

      return { order, discount };
    });
  }

  /**
   * Generate unique order number for bundles
   */
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `BNDL${year}${month}${day}${sequence}`;
  }
}
