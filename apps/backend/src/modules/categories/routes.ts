import type { FastifyInstance } from 'fastify';
import { CategoryService } from './service.js';
import { success } from '../../shared/utils/response.js';

export const categoryRoutes = async (fastify: FastifyInstance) => {
  const categoryService = new CategoryService(fastify.prisma);

  // GET /api/categories - List all categories
  fastify.get('/api/categories', async () => {
    const categories = await categoryService.getCategories();
    return success(categories);
  });
};
