import { prisma } from '../../shared/lib/prisma.js';
import { ProductAvailability } from './types';


export class ProductFilterService {
  async getEligibleProducts(petType?: string, categories?: string[], budget?: number) {
    const where: any = {
      isActive: true,
      unlimitedFurEligible: true,
    };

    if (petType) {
      where.unlimitedFurPetTypes = { has: petType };
    }

    if (categories && categories.length > 0) {
      where.category = {
        slug: { in: categories },
      };
    }

    if (budget) {
      where.OR = [
        { unlimitedFurMinBudget: null },
        { unlimitedFurMinBudget: { lte: budget } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    return products;
  }

  checkProductAffordability(productPrice: number, remainingBudget: number): boolean {
    return productPrice <= remainingBudget;
  }

  async getProductAvailability(
    productId: string,
    variantId: string,
    petType: string,
    remainingBudget: number
  ): Promise<ProductAvailability> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: { where: { id: variantId } },
      },
    });

    if (!product) {
      return {
        productId,
        variantId,
        isEligible: false,
        isAffordable: false,
        isSelectable: false,
        blockingReason: 'not_eligible',
      };
    }

    const variant = product.variants[0];
    if (!variant) {
      return {
        productId,
        variantId,
        isEligible: false,
        isAffordable: false,
        isSelectable: false,
        blockingReason: 'not_eligible',
      };
    }

    const isEligible = product.unlimitedFurEligible && product.unlimitedFurPetTypes.includes(petType);
    const isAffordable = variant.price <= remainingBudget;
    const inStock = variant.stock > 0;

    let blockingReason: ProductAvailability['blockingReason'];
    if (!isEligible) blockingReason = 'not_eligible';
    else if (!product.unlimitedFurPetTypes.includes(petType)) blockingReason = 'wrong_pet_type';
    else if (!isAffordable) blockingReason = 'exceeds_budget';
    else if (!inStock) blockingReason = 'out_of_stock';

    return {
      productId,
      variantId,
      isEligible,
      isAffordable,
      isSelectable: isEligible && isAffordable && inStock,
      blockingReason,
    };
  }
}
