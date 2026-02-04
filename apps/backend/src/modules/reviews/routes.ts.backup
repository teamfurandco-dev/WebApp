import type { FastifyInstance } from 'fastify';
import { reviewService } from './service.js';
import { createReviewSchema, updateReviewSchema, reviewQuerySchema } from './schema.js';
import { success } from '../../shared/utils/response.js';
import { authenticate, optionalAuth } from '../../shared/middleware/auth.js';

export const reviewRoutes = async (fastify: FastifyInstance) => {
  // GET /products/:productId/reviews - Get product reviews
  fastify.get(
    '/products/:productId/reviews',
    {
      preHandler: optionalAuth,
      schema: {
        description: 'Get reviews for a specific product',
        tags: ['Reviews'],
        params: {
          type: 'object',
          properties: {
            productId: { type: 'string', format: 'uuid', description: 'Product ID' }
          },
          required: ['productId']
        },
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, description: 'Page number' },
            limit: { type: 'number', minimum: 1, maximum: 50, description: 'Items per page' },
            rating: { type: 'number', minimum: 1, maximum: 5, description: 'Filter by rating' },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'], description: 'Filter by status' }
          }
        },
        response: {
          200: {
            description: 'Product reviews with pagination',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  reviews: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        rating: { type: 'number' },
                        title: { type: 'string' },
                        comment: { type: 'string' },
                        status: { type: 'string' },
                        isVerifiedPurchase: { type: 'boolean' },
                        createdAt: { type: 'string' },
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            avatarUrl: { type: 'string' }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'number' },
                      limit: { type: 'number' },
                      total: { type: 'number' },
                      totalPages: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (request: any) => {
      const { productId } = request.params;
      const query = reviewQuerySchema.parse(request.query);
      const result = await reviewService.getProductReviews(productId, query);
      return success(result);
    }
  );

  // POST /products/:productId/reviews - Create review
  fastify.post(
    '/products/:productId/reviews',
    {
      preHandler: authenticate,
      schema: {
        description: 'Create a new review for a product',
        tags: ['Reviews'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            productId: { type: 'string', format: 'uuid', description: 'Product ID' }
          },
          required: ['productId']
        },
        body: {
          type: 'object',
          properties: {
            rating: { type: 'number', minimum: 1, maximum: 5, description: 'Rating from 1 to 5 stars' },
            title: { type: 'string', maxLength: 100, description: 'Review title (optional)' },
            comment: { type: 'string', maxLength: 1000, description: 'Review comment (optional)' }
          },
          required: ['rating']
        },
        response: {
          200: {
            description: 'Created review',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  rating: { type: 'number' },
                  title: { type: 'string' },
                  comment: { type: 'string' },
                  status: { type: 'string' },
                  isVerifiedPurchase: { type: 'boolean' },
                  createdAt: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: any) => {
      const { productId } = request.params;
      const data = createReviewSchema.parse(request.body);
      const review = await reviewService.createReview(productId, request.user.id, data);
      return success(review);
    }
  );

  // PATCH /reviews/:reviewId - Update review
  fastify.patch(
    '/reviews/:reviewId',
    {
      preHandler: authenticate,
      schema: {
        params: {
          type: 'object',
          properties: {
            reviewId: { type: 'string', format: 'uuid' }
          },
          required: ['reviewId']
        }
      }
    },
    async (request: any) => {
      const { reviewId } = request.params;
      const data = updateReviewSchema.parse(request.body);
      const review = await reviewService.updateReview(reviewId, request.user.id, data);
      return success(review);
    }
  );

  // DELETE /reviews/:reviewId - Delete review
  fastify.delete(
    '/reviews/:reviewId',
    {
      preHandler: authenticate,
      schema: {
        params: {
          type: 'object',
          properties: {
            reviewId: { type: 'string', format: 'uuid' }
          },
          required: ['reviewId']
        }
      }
    },
    async (request: any) => {
      const { reviewId } = request.params;
      const result = await reviewService.deleteReview(reviewId, request.user.id);
      return success(result);
    }
  );

  // PATCH /admin/reviews/:reviewId/moderate - Moderate review (admin only)
  fastify.patch(
    '/admin/reviews/:reviewId/moderate',
    {
      preHandler: authenticate,
      schema: {
        params: {
          type: 'object',
          properties: {
            reviewId: { type: 'string', format: 'uuid' }
          },
          required: ['reviewId']
        },
        body: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['APPROVED', 'REJECTED'] }
          },
          required: ['status']
        }
      }
    },
    async (request: any) => {
      // Check if user is admin
      if (request.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const { reviewId } = request.params;
      const { status } = request.body;
      const review = await reviewService.moderateReview(reviewId, status);
      return success(review);
    }
  );
};
