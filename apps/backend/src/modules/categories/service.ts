import type { PrismaClient } from '@prisma/client';

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  async getCategories() {
    return await this.prisma.categories.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
