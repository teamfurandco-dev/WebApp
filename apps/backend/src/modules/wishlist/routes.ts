import { FastifyInstance } from 'fastify';
import { wishlistService } from './service.js';
import { addToWishlistSchema } from './schema.js';
import { authenticate } from '../../shared/middleware/auth.js';

export async function wishlistRoutes(fastify: FastifyInstance) {
  // Get wishlist
  fastify.get('/wishlist', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const wishlist = await wishlistService.getWishlist(userId);
    return { data: wishlist };
  });
  
  // Add to wishlist
  fastify.post('/wishlist', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { productId, variantId } = addToWishlistSchema.parse(request.body);
    const item = await wishlistService.addToWishlist(userId, productId, variantId);
    return reply.code(201).send({ data: item });
  });
  
  // Check if in wishlist
  fastify.get('/wishlist/check/:productId', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { productId } = request.params as { productId: string };
    const { variantId } = request.query as { variantId?: string };
    const inWishlist = await wishlistService.isInWishlist(userId, productId, variantId);
    return { data: { inWishlist } };
  });
  
  // Remove from wishlist
  fastify.delete('/wishlist/:itemId', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { itemId } = request.params as { itemId: string };
    await wishlistService.removeFromWishlist(userId, itemId);
    return reply.code(204).send();
  });
  
  // Clear wishlist
  fastify.delete('/wishlist', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    await wishlistService.clearWishlist(userId);
    return reply.code(204).send();
  });
}
