import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';

export class CartService {
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
