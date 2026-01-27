import { FastifyInstance } from 'fastify';
import { productService } from './service.js';
import { authenticateAdmin } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';

/**
 * Product routes for browsing and administration
 */
export async function productRoutes(fastify: FastifyInstance) {
  // Public routes
  // Get products with filters
  fastify.get('/products', {
    schema: {
      description: 'Get products with optional filters',
      tags: ['Products'],
      querystring: {
        type: 'object',
        properties: {
          categoryId: { type: 'string', format: 'uuid', description: 'Filter by category ID' },
          isFeatured: { type: 'boolean', description: 'Filter featured products' },
          search: { type: 'string', description: 'Search in name and description' },
          page: { type: 'number', minimum: 1, description: 'Page number' },
          limit: { type: 'number', minimum: 1, maximum: 100, description: 'Items per page' }
        }
      },
      response: {
        200: {
          description: 'List of products',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  description: { type: 'string' },
                  averageRating: { type: 'number' },
                  reviewCount: { type: 'number' },
                  category: { type: 'string' },
                  variants: { type: 'array' },
                  images: { type: 'array' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const products = await productService.getProducts(request.query as any);
    return success(products);
  });

  // Get single product
  fastify.get('/products/:idOrSlug', {
    schema: {
      description: 'Get a single product by ID or slug',
      tags: ['Products'],
      params: {
        type: 'object',
        properties: {
          idOrSlug: { type: 'string', description: 'Product ID (UUID) or slug' }
        },
        required: ['idOrSlug']
      },
      response: {
        200: {
          description: 'Product details',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
                description: { type: 'string' },
                averageRating: { type: 'number' },
                reviewCount: { type: 'number' },
                variants: { type: 'array' },
                images: { type: 'array' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const product = await productService.getProduct(idOrSlug);
    return success(product);
  });

  // Get product variants
  fastify.get('/products/:productId/variants', {
    schema: {
      description: 'Get all variants for a specific product',
      tags: ['Products'],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string', format: 'uuid', description: 'Product ID' }
        },
        required: ['productId']
      },
      response: {
        200: {
          description: 'Product variants',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  sku: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  stock: { type: 'number' },
                  stockStatus: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const variants = await productService.getProductVariants(productId);
    return success(variants);
  });

  // Admin routes
  // Get all products for admin
  fastify.get('/admin/products', { preHandler: authenticateAdmin }, async (request, reply) => {
    const products = await productService.getAllProductsAdmin();
    return success(products);
  });

  // Create product
  fastify.post('/admin/products', { preHandler: authenticateAdmin }, async (request, reply) => {
    const product = await productService.createProduct(request.body);
    return reply.code(201).send(success(product));
  });

  // Update product
  fastify.put('/admin/products/:id', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await productService.updateProduct(id, request.body);
    return success(product);
  });

  // Delete product
  fastify.delete('/admin/products/:id', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await productService.deleteProduct(id);
    return success({ deleted: true });
  });

  // Update product status
  fastify.patch('/admin/products/:id/status', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isActive } = request.body as { isActive: boolean };
    const product = await productService.updateProductStatus(id, isActive);
    return success(product);
  });
}
