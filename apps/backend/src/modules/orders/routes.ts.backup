import { FastifyInstance } from 'fastify';
import { orderService } from './service.js';
import { createOrderSchema, updateOrderStatusSchema, orderQuerySchema } from './schema.js';
import { authenticate, authenticateAdmin } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';

/**
 * Order routes for managing shop orders
 */
export async function orderRoutes(fastify: FastifyInstance) {
  // Get user's orders
  fastify.get('/orders/me', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const filters = orderQuerySchema.parse(request.query);
    const orders = await orderService.getOrders(userId, filters);
    return success(orders);
  });

  // Get single order
  fastify.get('/orders/:id', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const order = await orderService.getOrder(userId, id);
    return success(order);
  });

  // Get order by order number
  fastify.get('/orders/number/:orderNumber', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { orderNumber } = request.params as { orderNumber: string };
    const order = await orderService.getOrderByNumber(userId, orderNumber);
    return success(order);
  });

  // Create order
  fastify.post('/orders', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const data = createOrderSchema.parse(request.body);
    const order = await orderService.createOrder(userId, data);
    return reply.code(201).send(success(order));
  });

  // Cancel order
  fastify.post('/orders/:id/cancel', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const order = await orderService.cancelOrder(userId, id);
    return success(order);
  });

  // Admin routes
  // Get all orders (admin only)
  fastify.get('/orders', { preHandler: authenticateAdmin }, async (request, reply) => {
    const orders = await orderService.getAllOrders();
    return success(orders);
  });

  // Update order status (admin only)
  fastify.patch('/orders/:id/status', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateOrderStatusSchema.parse(request.body);
    const order = await orderService.updateOrderStatus(id, data);
    return success(order);
  });
}
