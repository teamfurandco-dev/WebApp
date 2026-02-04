import type { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/lib/prisma.js';
import { success } from '../../shared/utils/response.js';

/**
 * Category routes for product categorization
 */
export async function categoryRoutes(fastify: FastifyInstance) {
  // GET /categories - List all active categories
  fastify.get('/categories', {
    schema: {
      description: 'Get all active categories - Used by ProductList page for filtering',
      tags: ['Currently in Use', 'Categories'],
      response: {
        200: {
          description: 'List of categories',
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
                  description: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, async () => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });
    return success(categories);
  });
}
