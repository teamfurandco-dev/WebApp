import { prisma } from '../../shared/lib/prisma.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/index.js';

export class DraftService {
  async createDraft(userId: string, mode: string, budget: number, petType: string, products: any[]) {
    const draft = await prisma.$transaction(async (tx) => {
      const newDraft = await tx.unlimitedFurDraft.create({
        data: {
          userId,
          mode,
          budget,
          petType,
          status: 'draft'
        }
      });

      if (products.length > 0) {
        await tx.draftProduct.createMany({
          data: products.map(p => ({
            draftId: newDraft.id,
            productId: p.productId,
            variantId: p.variantId,
            quantity: p.quantity,
            lockedPrice: p.price
          }))
        });
      }

      return newDraft;
    });

    const wallet = await this.calculateWallet(draft.id);
    return { draftId: draft.id, wallet, expiresAt: draft.expiresAt };
  }

  async updateProducts(draftId: string, userId: string, action: string, productId: string, variantId: string, quantity: number) {
    const draft = await prisma.unlimitedFurDraft.findFirst({
      where: { id: draftId, userId, status: 'draft' }
    });
    if (!draft) throw new NotFoundError('Draft');

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId }
    });
    if (!variant) throw new NotFoundError('Variant');

    if (action === 'add') {
      const existing = await prisma.draftProduct.findUnique({
        where: { draftId_productId_variantId: { draftId, productId, variantId } }
      });

      if (existing) {
        await prisma.draftProduct.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity }
        });
      } else {
        await prisma.draftProduct.create({
          data: { draftId, productId, variantId, quantity, lockedPrice: variant.price }
        });
      }
    } else if (action === 'remove') {
      await prisma.draftProduct.deleteMany({
        where: { draftId, productId, variantId }
      });
    }

    const wallet = await this.calculateWallet(draftId);
    const products = await this.getDraftProducts(draftId);
    return { wallet, products };
  }

  async calculateWallet(draftId: string) {
    const draft = await prisma.unlimitedFurDraft.findUnique({
      where: { id: draftId },
      include: { products: true }
    });

    const spent = draft.products.reduce((sum, p) => sum + (p.lockedPrice * p.quantity), 0);
    return {
      budget: draft.budget,
      spent,
      remaining: draft.budget - spent,
      canAddMore: spent < draft.budget
    };
  }

  async getDraftProducts(draftId: string) {
    const products = await prisma.draftProduct.findMany({
      where: { draftId },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 }
              }
            }
          }
        }
      }
    });

    return products.map(p => {
      const primaryImage = p.variant.product.images[0];
      return {
        id: p.id,
        productId: p.productId,
        variantId: p.variantId,
        quantity: p.quantity,
        price: p.lockedPrice,
        name: p.variant.product.name,
        variantName: p.variant.name,
        image: primaryImage ? getPublicUrl(primaryImage.bucketName, primaryImage.filePath) : null,
      };
    });
  }
}

export const draftService = new DraftService();
