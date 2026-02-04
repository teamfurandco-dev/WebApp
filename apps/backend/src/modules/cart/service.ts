import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';

export class CartService {
  /**
   * Get optimized cart summary with all data in one call
   */
  async getCartSummaryOptimized(userId: string) {
    // Get cart items with full product details
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    let subtotal = 0;
    let totalItems = 0;
    const stockWarnings = [];
    
    const items = cartItems.map(item => {
      const itemTotal = item.variant.priceCents * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;
      
      // Check for stock warnings
      if (item.variant.stock < item.quantity) {
        stockWarnings.push({
          itemId: item.id,
          productName: item.variant.product.name,
          variantName: item.variant.name,
          requested: item.quantity,
          available: item.variant.stock
        });
      }
      
      return this.transformCartItem(item);
    });

    // Get recommended products based on cart categories
    const categoryIds = [...new Set(cartItems.map(item => item.variant.product.categoryId))];
    const recommendedProducts = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        isActive: true,
        id: { notIn: cartItems.map(item => item.variant.product.id) }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        averageRating: true,
        variants: {
          select: { priceCents: true },
          orderBy: { priceCents: 'asc' },
          take: 1
        }
      },
      take: 4,
      orderBy: { averageRating: 'desc' }
    });

    const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over $50
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + shipping + tax;

    return {
      items,
      totals: {
        subtotal,
        shipping,
        tax,
        total,
        itemCount: totalItems
      },
      stockWarnings,
      recommendedProducts: recommendedProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        images: p.images,
        averageRating: p.averageRating,
        minPrice: p.variants[0]?.priceCents || 0
      }))
    };
  }

  /**
   * Get user's cart with product details
   */
  async getCart(userId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cartItems.map(item => this.transformCartItem(item));
  }

  /**
   * Add item to cart or update quantity if exists
   */
  async addToCart(userId: string, variantId: string, quantity: number) {
    if (quantity <= 0) throw new BadRequestError('Quantity must be greater than zero');

    // Check if variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundError('Product variant');
    }

    if (!variant.isActive || !variant.product.isActive) {
      throw new BadRequestError('Product is currently not available');
    }

    if (variant.stock < quantity) {
      throw new BadRequestError(`Only ${variant.stock} items available in stock`);
    }

    // Check if item already in cart
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_variantId: { userId, variantId },
      },
    });

    if (existing) {
      const newQuantity = existing.quantity + quantity;

      if (variant.stock < newQuantity) {
        throw new BadRequestError(`Only ${variant.stock} items available in stock`);
      }

      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    return prisma.cartItem.create({
      data: { userId, variantId, quantity },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                category: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId: string, itemId: string, quantity: number) {
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { variant: true },
    });

    if (!item) {
      throw new NotFoundError('Cart item');
    }

    if (quantity < 0) throw new BadRequestError('Quantity cannot be negative');

    // Remove if quantity is 0
    if (quantity === 0) {
      return this.removeFromCart(userId, itemId);
    }

    // Check stock
    if (item.variant.stock < quantity) {
      throw new BadRequestError(`Only ${item.variant.stock} items available in stock`);
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                category: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: string, itemId: string) {
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundError('Cart item');
    }

    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: string) {
    return prisma.cartItem.deleteMany({ where: { userId } });
  }

  /**
   * Get cart summary
   */
  async getCartSummary(userId: string) {
    const items = await this.getCart(userId);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);

    return {
      totalItems,
      subtotal,
      itemsCount: items.length,
    };
  }

  /**
   * Transform cart item to include image URLs
   */
  private transformCartItem(item: any) {
    const primaryImage = item.variant.product.images[0];
    return {
      ...item,
      variant: {
        ...item.variant,
        product: {
          ...item.variant.product,
          primaryImage: primaryImage ? {
            ...primaryImage,
            url: getPublicUrl(primaryImage.bucketName, primaryImage.filePath),
          } : null,
          images: item.variant.product.images.map((img: any) => ({
            ...img,
            url: getPublicUrl(img.bucketName, img.filePath),
          })),
        },
      },
    };
  }
}

export const cartService = new CartService();
