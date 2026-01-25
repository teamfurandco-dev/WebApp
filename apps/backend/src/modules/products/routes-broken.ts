import { FastifyInstance } from 'fastify';
import { productService } from './service.js';
import {
  productQuerySchema,
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
  createProductImageSchema,
} from './schema.js';
import { authenticate, authenticateAdmin } from '../../shared/middleware/auth.js';

export async function productRoutes(fastify: FastifyInstance) {
  // Public routes
  // Get products with filters
  fastify.get('/products', async (request, reply) => {
    const filters = productQuerySchema.parse(request.query);
    const products = await productService.getProducts(filters);
    return { data: products };
  });
  
  // Get homepage products by section
  fastify.get('/products/homepage/:section', async (request, reply) => {
    const { section } = request.params as { section: string };
    const products = await productService.getHomepageProducts(section);
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
    const data = createProductSchema.parse(request.body);
    const product = await productService.createProduct(data);
    return reply.code(201).send({ data: product });
  });

  // Update product
  fastify.put('/admin/products/:id', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateProductSchema.parse(request.body);
    const product = await productService.updateProduct(id, data);
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
    
    if (!product) {
      return reply.code(404).send({ error: 'Product not found' });
    }
    
    return { data: product };
  });
  
  // Create product (admin only)
  fastify.post('/products', async (request, reply) => {
    const data = createProductSchema.parse(request.body);
    const product = await productService.createProduct(data);
    return reply.code(201).send({ data: product });
  });
  
  // Update product (admin only)
  fastify.patch('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateProductSchema.parse(request.body);
    const product = await productService.updateProduct(id, data);
    return { data: product };
  });
  
  // Delete product (admin only)
  fastify.delete('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await productService.deleteProduct(id);
    return reply.code(204).send();
  });
  
  // Variant routes
  fastify.post('/products/variants', async (request, reply) => {
    const data = createVariantSchema.parse(request.body);
    const variant = await productService.createVariant(data);
    return reply.code(201).send({ data: variant });
  });
  
  fastify.patch('/products/variants/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateVariantSchema.parse(request.body);
    const variant = await productService.updateVariant(id, data);
    return { data: variant };
  });
  
  fastify.delete('/products/variants/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await productService.deleteVariant(id);
    return reply.code(204).send();
  });
  
  // Image routes
  fastify.post('/products/images', async (request, reply) => {
    const data = createProductImageSchema.parse(request.body);
    const image = await productService.addProductImage(data);
    return reply.code(201).send({ data: image });
  });
  
  fastify.delete('/products/images/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await productService.deleteProductImage(id);
    return reply.code(204).send();
  });
}
