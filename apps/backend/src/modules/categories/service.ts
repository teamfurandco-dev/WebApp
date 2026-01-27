import { prisma } from '../../shared/lib/prisma.js';

/**
 * Service for managing product categories
 */
export class CategoryService {
    /**
     * Get all active categories ordered by name
     */
    async getCategories() {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
}

export const categoryService = new CategoryService();
