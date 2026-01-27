import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';

export class WishlistService {
    /**
     * Get user's wishlist with product details
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
     * Add product to wishlist
     */
    async addToWishlist(userId: string, productId: string, variantId?: string) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || !product.isActive) {
            throw new NotFoundError('Product');
        }

        if (variantId) {
            const variant = await prisma.productVariant.findUnique({
                where: { id: variantId },
            });

            if (!variant || !variant.isActive) {
                throw new NotFoundError('Product variant');
            }
        }

        // Type casting to bypass strict unique key check
        const existing = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId_variantId: {
                    userId,
                    productId,
                    variantId: variantId as any,
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
            throw new NotFoundError('Wishlist item');
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
                    variantId: variantId as any,
                },
            },
        });

        return !!item;
    }

    /**
     * Clear entire wishlist
     */
    async clearWishlist(userId: string) {
        return prisma.wishlistItem.deleteMany({ where: { userId } });
    }

    /**
     * Transform wishlist item to include image URLs
     */
    private transformWishlistItem(item: any) {
        const primaryImage = item.product.images[0];
        return {
            ...item,
            product: {
                ...item.product,
                primaryImage: primaryImage ? {
                    ...primaryImage,
                    url: getPublicUrl(primaryImage.bucketName, primaryImage.filePath),
                } : null,
                images: item.product.images.map((img: any) => ({
                    ...img,
                    url: getPublicUrl(img.bucketName, img.filePath),
                })),
            },
        };
    }
}

export const wishlistService = new WishlistService();
