import { prisma } from '../../shared/lib/prisma.js';
import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors/index.js';
import type { CreateReviewData, UpdateReviewData, ReviewQuery } from './schema.js';

export class ReviewService {
  static async getProductReviews(productId: string, query: ReviewQuery) {
    const { page, limit, rating, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      productId,
      ...(rating && { rating }),
      ...(status && { status }),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where })
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async createReview(productId: string, userId: string, data: CreateReviewData) {
    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId }
    });
    if (existingReview) {
      throw new ConflictError('You have already reviewed this product');
    }

    // Check if user purchased this product (optional verification)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, status: 'DELIVERED' }
      }
    });

    const review = await prisma.review.create({
      data: {
        ...data,
        productId,
        userId,
        isVerifiedPurchase: !!hasPurchased,
        status: 'APPROVED', // Auto-approve for now
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    // Update product rating aggregation
    await this.updateProductRating(productId);

    return review;
  }

  static async updateReview(reviewId: string, userId: string, data: UpdateReviewData) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== userId) {
      throw new ValidationError('You can only update your own reviews');
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    // Update product rating aggregation
    await this.updateProductRating(review.productId);

    return updatedReview;
  }

  static async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== userId) {
      throw new ValidationError('You can only delete your own reviews');
    }

    await prisma.review.delete({ where: { id: reviewId } });

    // Update product rating aggregation
    await this.updateProductRating(review.productId);

    return { success: true };
  }

  static async updateProductRating(productId: string) {
    const stats = await prisma.review.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count.rating || 0,
      }
    });
  }

  static async moderateReview(reviewId: string, status: 'APPROVED' | 'REJECTED') {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    // Update product rating aggregation
    await this.updateProductRating(review.productId);

    return review;
  }
}

export const reviewService = ReviewService;
