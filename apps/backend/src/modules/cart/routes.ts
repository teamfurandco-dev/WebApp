import { FastifyInstance, FastifyRequest } from 'fastify';
import { cartService } from './service.js';
import { addToCartSchema, updateCartItemSchema } from './schema.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';

/**
 * Cart routes for managing user shopping cart
 */
export async function cartRoutes(fastify: FastifyInstance) {
  // Get cart
  fastify.get('/cart', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const cart = await cartService.getCart(userId);
    return success(cart);
  });

  // Get cart summary
  fastify.get('/cart/summary', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const summary = await cartService.getCartSummary(userId);
    return success(summary);
  });

  // Add to cart
  fastify.post('/cart', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { variantId, quantity } = addToCartSchema.parse(request.body);
    const item = await cartService.addToCart(userId, variantId, quantity);
    return reply.code(201).send(success(item));
  });

  // Update cart item quantity
  fastify.patch('/cart/:itemId', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { itemId } = request.params as { itemId: string };
    const { quantity } = updateCartItemSchema.parse(request.body);
    const item = await cartService.updateCartItem(userId, itemId, quantity);
    return success(item);
  });

  // Remove from cart
  fastify.delete('/cart/:itemId', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { itemId } = request.params as { itemId: string };
    await cartService.removeFromCart(userId, itemId);
    return reply.code(204).send();
  });

  // Clear entire cart
  fastify.delete('/cart', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    await cartService.clearCart(userId);
    return reply.code(204).send();
  });
}
