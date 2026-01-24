import { FastifyInstance } from 'fastify';
import { productService } from './service.js';
import { authenticate, authenticateAdmin } from '../../shared/middleware/auth.js';

export async function productRoutes(fastify: FastifyInstance) {
  // Public routes
  // Get products with filters
  fastify.get('/products', async (request, reply) => {
    const products = await productService.getProducts(request.query as any);
    return { data: products };
  });
  
  // Get single product
  fastify.get('/products/:idOrSlug', async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const product = await productService.getProduct(idOrSlug);
    return { data: product };
  });

  // Admin routes
  // Get all products for admin
  fastify.get('/admin/products', { preHandler: authenticateAdmin }, async (request, reply) => {
    const products = await productService.getAllProductsAdmin();
    return { data: products };
  });

  // Create product
  fastify.post('/admin/products', { preHandler: authenticateAdmin }, async (request, reply) => {
    const product = await productService.createProduct(request.body);
    return reply.code(201).send({ data: product });
  });

  // Update product
  fastify.put('/admin/products/:id', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await productService.updateProduct(id, request.body);
    return { data: product };
  });

  // Delete product
  fastify.delete('/admin/products/:id', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await productService.deleteProduct(id);
    return { success: true };
  });

  // Update product status
  fastify.patch('/admin/products/:id/status', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isActive } = request.body as { isActive: boolean };
    const product = await productService.updateProductStatus(id, isActive);
    return { data: product };
  });
}
