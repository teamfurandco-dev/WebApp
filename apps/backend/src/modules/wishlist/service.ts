import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';


export class WishlistService {
  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string) {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            variants: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
            category: true,
          },
        },
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return items.map(item => this.transformWishlistItem(item));
  }
  
  /**
   * Add to wishlist
   */
  async addToWishlist(userId: string, productId: string, variantId?: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product || !product.isActive) {
      throw new Error('Product not found or not available');
    }
    
    // Check if variant exists if provided
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });
      
      if (!variant || !variant.isActive) {
        throw new Error('Product variant not found or not available');
      }
    }
    
    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId,
          productId,
          variantId: variantId || null,
        },
      },
    });
    
    if (existing) {
      return existing;
    }
    
    return prisma.wishlistItem.create({
      data: { userId, productId, variantId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            variants: { where: { isActive: true } },
            category: true,
          },
        },
        variant: true,
      },
    });
  }
  
  /**
   * Remove from wishlist
   */
  async removeFromWishlist(userId: string, itemId: string) {
    const item = await prisma.wishlistItem.findFirst({
      where: { id: itemId, userId },
    });
    
    if (!item) {
      throw new Error('Wishlist item not found');
    }
    
    return prisma.wishlistItem.delete({ where: { id: itemId } });
  }
  
  /**
   * Check if product is in wishlist
   */
  async isInWishlist(userId: string, productId: string, variantId?: string) {
    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId,
          productId,
          variantId: variantId || null,
        },
      },
    });
    
    return !!item;
  }
  
  /**
   * Clear wishlist
   */
  async clearWishlist(userId: string) {
    return prisma.wishlistItem.deleteMany({ where: { userId } });
  }
  
  /**
   * Transform wishlist item to include image URLs
   */
  private transformWishlistItem(item: any) {
    return {
      ...item,
      product: {
        ...item.product,
        images: item.product.images.map((img: any) => ({
          ...img,
          url: getPublicUrl(img.bucketName, img.filePath),
        })),
      },
    };
  }
}

export const wishlistService = new WishlistService();
