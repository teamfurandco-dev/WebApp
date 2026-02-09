import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';

export class ShopService {
  async getShopInit(budget: number, petType: string) {
    const products = await prisma.product.findMany({
      where: {
        unlimitedFurEligible: true,
        unlimitedFurPetTypes: { has: petType },
        unlimitedFurMinBudget: { lte: budget },
        isActive: true
      },
      include: {
        variants: {
          where: { isActive: true, stock: { gt: 0 } },
          orderBy: { price: 'asc' }
        },
        images: {
          where: { isPrimary: true },
          take: 1
        },
        category: { select: { id: true, name: true, slug: true } }
      },
      orderBy: { displayOrder: 'asc' }
    });

    const transformed = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: p.category,
      minPrice: p.variants[0]?.price || 0,
      maxPrice: p.variants[p.variants.length - 1]?.price || 0,
      variants: p.variants,
      images: p.images.map(img => ({
        url: getPublicUrl(img.bucketName, img.filePath),
        altText: img.altText
      })),
      averageRating: p.averageRating,
      reviewCount: p.reviewCount
    }));

    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {
            unlimitedFurEligible: true,
            unlimitedFurPetTypes: { has: petType },
            isActive: true
          }
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } }
      }
    });

    return { products: transformed, categories };
  }
}

export const shopService = new ShopService();
