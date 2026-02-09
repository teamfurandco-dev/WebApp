import { FastifyInstance } from 'fastify';
import { wishlistService } from './service.js';
import { addToWishlistSchema } from './schema.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';

/**
 * Wishlist routes
 */
export async function wishlistRoutes(fastify: FastifyInstance) {
  // Get wishlist with full product details
  fastify.get('/wishlist/full', { 
    preHandler: authenticate,
    schema: {
      description: 'Get wishlist with full product details and variants',
      tags: ['Wishlist', 'Currently in Use - Optimized'],
    }
  }, async (request: any, reply) => {
    const userId = request.user.id;
    const wishlistFull = await wishlistService.getWishlistFull(userId);
    return success(wishlistFull);
  });

  // Get wishlist
  fastify.get('/wishlist', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const wishlist = await wishlistService.getWishlist(userId);
    return success(wishlist);
  });

  // Add item
  fastify.post('/wishlist', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { productId, variantId } = addToWishlistSchema.parse(request.body);
    const item = await wishlistService.addToWishlist(userId, productId, variantId);
    return reply.code(201).send(success(item));
  });

  // Check item
  fastify.get('/wishlist/check/:productId', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { productId } = request.params as { productId: string };
    const { variantId } = request.query as { variantId?: string };
    const inWishlist = await wishlistService.isInWishlist(userId, productId, variantId);
    return success({ inWishlist });
  });

  // Remove item
  fastify.delete('/wishlist/:itemId', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { itemId } = request.params as { itemId: string };
    await wishlistService.removeFromWishlist(userId, itemId);
    return reply.code(204).send();
  });

  // Clear wishlist
  fastify.delete('/wishlist', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    await wishlistService.clearWishlist(userId);
    return reply.code(204).send();
  });
}
