import type { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/lib/prisma.js';

export async function categoryRoutes(fastify: FastifyInstance) {
  // GET /categories - List all categories
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
    return { data: categories };
  });
}
