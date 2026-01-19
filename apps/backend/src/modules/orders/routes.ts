import { FastifyInstance } from 'fastify';
import { orderService } from './service.js';
import { createOrderSchema, updateOrderStatusSchema, orderQuerySchema } from './schema.js';
import { authenticate } from '../../shared/middleware/auth.js';

export async function orderRoutes(fastify: FastifyInstance) {
  // Get user's orders
  fastify.get('/orders', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const filters = orderQuerySchema.parse(request.query);
    const orders = await orderService.getOrders(userId, filters);
    return { data: orders };
  });
  
  // Get single order
  fastify.get('/orders/:id', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const order = await orderService.getOrder(userId, id);
    return { data: order };
  });
  
  // Get order by order number
  fastify.get('/orders/number/:orderNumber', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { orderNumber } = request.params as { orderNumber: string };
    const order = await orderService.getOrderByNumber(userId, orderNumber);
    return { data: order };
  });
  
  // Create order
  fastify.post('/orders', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const data = createOrderSchema.parse(request.body);
    const order = await orderService.createOrder(userId, data);
    return reply.code(201).send({ data: order });
  });
  
  // Cancel order
  fastify.post('/orders/:id/cancel', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const order = await orderService.cancelOrder(userId, id);
    return { data: order };
  });
  
  // Update order status (admin only - add admin check middleware)
  fastify.patch('/orders/:id/status', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateOrderStatusSchema.parse(request.body);
    const order = await orderService.updateOrderStatus(id, data);
    return { data: order };
  });
}
