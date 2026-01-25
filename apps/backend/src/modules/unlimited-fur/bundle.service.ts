import { prisma } from '../../shared/lib/prisma.js';
import { WalletState } from './types';
import { BUNDLE_MIN_PRODUCTS, BUNDLE_DISCOUNT_RATE } from './constants';
import { NotFoundError, BadRequestError } from '../../shared/errors';


interface BundleProduct {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}

export class BundleService {
  private bundles: Map<string, {
    id: string;
    userId: string;
    bundleBudget: number;
    petType: string;
    selectedCategories: string[];
    products: BundleProduct[];
  }> = new Map();

  async createDraft(userId: string) {
    const id = `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bundle = {
      id,
      userId,
      bundleBudget: 0,
      petType: '',
      selectedCategories: [],
      products: [],
    };
    this.bundles.set(id, bundle);
    return { id };
  }

  async updateBudget(bundleId: string, userId: string, bundleBudget: number) {
    const bundle = this.bundles.get(bundleId);
    if (!bundle || bundle.userId !== userId) throw new NotFoundError('Bundle not found');
    
    bundle.bundleBudget = bundleBudget;
    return bundle;
  }

  async updatePetProfile(bundleId: string, userId: string, petType: string) {
    const bundle = this.bundles.get(bundleId);
    if (!bundle || bundle.userId !== userId) throw new NotFoundError('Bundle not found');
    
    bundle.petType = petType;
    return bundle;
  }

  async updateCategories(bundleId: string, userId: string, selectedCategories: string[]) {
    const bundle = this.bundles.get(bundleId);
    if (!bundle || bundle.userId !== userId) throw new NotFoundError('Bundle not found');
    
    bundle.selectedCategories = selectedCategories;
    return bundle;
  }

  async addProduct(bundleId: string, userId: string, productId: string, variantId: string, quantity: number) {
    const bundle = this.bundles.get(bundleId);
    if (!bundle || bundle.userId !== userId) throw new NotFoundError('Bundle not found');

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundError('Variant not found');

    const wallet = await this.calculateWallet(bundleId, userId);
    const totalCost = variant.price * quantity;
    
    if (wallet.remaining < totalCost) {
      throw new BadRequestError('Exceeds budget');
    }

    const existingIndex = bundle.products.findIndex(p => p.productId === productId && p.variantId === variantId);
    if (existingIndex >= 0) {
      bundle.products[existingIndex].quantity += quantity;
    } else {
      bundle.products.push({ productId, variantId, quantity, price: variant.price });
    }

    return bundle;
  }

  async removeProduct(bundleId: string, userId: string, productId: string) {
    const bundle = this.bundles.get(bundleId);
    if (!bundle || bundle.userId !== userId) throw new NotFoundError('Bundle not found');

    bundle.products = bundle.products.filter(p => p.productId !== productId);
    return { success: true };
  }

  async calculateWallet(bundleId: string, userId: string): Promise<WalletState> {
    const bundle = this.bundles.get(bundleId);
    if (!bundle || bundle.userId !== userId) throw new NotFoundError('Bundle not found');

    const spent = bundle.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const remaining = bundle.bundleBudget - spent;

    return {
      monthlyBudget: bundle.bundleBudget,
      spent,
      remaining,
      canAddMore: remaining > 0,
    };
  }

  calculateDiscount(products: BundleProduct[]): number {
    if (products.length < BUNDLE_MIN_PRODUCTS) return 0;
    
    const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return Math.floor(subtotal * BUNDLE_DISCOUNT_RATE);
  }

  async checkout(bundleId: string, userId: string, addressId: string, paymentMethod: string) {
    const bundle = this.bundles.get(bundleId);
    if (!bundle || bundle.userId !== userId) throw new NotFoundError('Bundle not found');
    if (bundle.products.length === 0) throw new BadRequestError('No products selected');

    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw new NotFoundError('Address not found');

    const subtotal = bundle.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const discount = this.calculateDiscount(bundle.products);
    const total = subtotal - discount;

    const orderNumber = `ORD${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const productDetails = await Promise.all(
      bundle.products.map(async p => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: p.variantId },
          include: { product: true },
        });
        return { ...p, variant };
      })
    );

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        discount,
        total,
        paymentMethod,
        shippingAddress: address,
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

    await prisma.oneTimeBundleOrder.create({
      data: {
        orderId: order.id,
        bundleBudget: bundle.bundleBudget,
        petType: bundle.petType,
        selectedCategories: bundle.selectedCategories,
        discountApplied: discount,
      },
    });

    this.bundles.delete(bundleId);

    return { order, discount };
  }
}
