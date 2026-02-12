import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';

export class WishlistService {
    /**
     * Get user's wishlist with full product details and variants
     */
    async getWishlistFull(userId: string) {
        const items = await prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        images: {
                            orderBy: { displayOrder: 'asc' },
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

        return items.map(item => {
            const transformed = this.transformWishlistItem(item);
            return {
                ...transformed,
                product: {
                    ...transformed.product,
                    variants: item.product.variants.map((v: any) => ({
                        id: v.id,
                        sku: v.sku,
                        name: v.name,
                        price_cents: v.price,
                        compare_at_price_cents: v.compareAtPrice,
                        stock: v.stock,
                    })),
                }
            };
        });
    }

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
                    variantId: variantId ?? null,
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
                    variantId: variantId ?? null,
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
     * Transform wishlist item to include image URLs and match frontend naming
     */
    private transformWishlistItem(item: any) {
        const primaryImage = item.product.images[0];
        const defaultVariant = item.product.variants[0];

        return {
            id: item.id,
            product_id: item.productId,
            variant_id: item.variantId,
            created_at: item.createdAt,
            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                description: item.product.description,
                category: item.product.category?.name,
                average_rating: item.product.averageRating,
                reviews_count: item.product.reviewCount,
                base_price_cents: defaultVariant?.price || 0,
                compare_at_price_cents: defaultVariant?.compareAtPrice || 0,
                price_cents: defaultVariant?.price || 0, // Fallback for some components
                image: primaryImage ? getPublicUrl(primaryImage.bucketName, primaryImage.filePath) : null,
                images: item.product.images.map((img: any) => getPublicUrl(img.bucketName, img.filePath)),
            },
            variant: item.variant ? {
                id: item.variant.id,
                name: item.variant.name,
                sku: item.variant.sku,
                price_cents: item.variant.price,
                compare_at_price_cents: item.variant.compareAtPrice,
                stock_quantity: item.variant.stock,
            } : null
        };
    }
}

export const wishlistService = new WishlistService();
