import type { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/lib/prisma.js';
import { success } from '../../shared/utils/response.js';

/**
 * Category routes for product categorization
 */
export async function categoryRoutes(fastify: FastifyInstance) {
  // GET /categories - List all active categories
  fastify.get('/categories', async () => {
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
