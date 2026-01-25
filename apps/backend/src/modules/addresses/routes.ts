import { FastifyInstance } from 'fastify';
import { addressService } from './service.js';
import { createAddressSchema, updateAddressSchema } from './schema.js';
import { authenticate } from '../../shared/middleware/auth.js';

export async function addressRoutes(fastify: FastifyInstance) {
  // Get all addresses
  fastify.get('/addresses', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const addresses = await addressService.getAddresses(userId);
    return { data: addresses };
  });
  
  // Get default address
  fastify.get('/addresses/default', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { type } = request.query as { type?: 'shipping' | 'billing' };
    const address = await addressService.getDefaultAddress(userId, type);
    return { data: address };
  });
  
  // Get single address
  fastify.get('/addresses/:id', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const address = await addressService.getAddress(userId, id);
    return { data: address };
  });
  
  // Create address
  fastify.post('/addresses', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const data = createAddressSchema.parse(request.body);
    const address = await addressService.createAddress(userId, data);
    return reply.code(201).send({ data: address });
  });
  
  // Update address
  fastify.patch('/addresses/:id', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const data = updateAddressSchema.parse(request.body);
    const address = await addressService.updateAddress(userId, id, data);
    return { data: address };
  });
  
  // Delete address
  fastify.delete('/addresses/:id', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    await addressService.deleteAddress(userId, id);
    return reply.code(204).send();
  });
  
  // Set default address
  fastify.post('/addresses/:id/default', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const address = await addressService.setDefaultAddress(userId, id);
    return { data: address };
  });
}
