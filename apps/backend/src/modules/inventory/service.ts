import { prisma } from '../../shared/lib/prisma.js';
import { NotFoundError } from '../../shared/errors/index.js';
import type { UpdateStockData, InventoryQuery, LowStockThresholdData } from './schema.js';

export class InventoryService {
  static async updateStock(variantId: string, data: UpdateStockData, userId?: string) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw new NotFoundError('Product variant not found');
    }

    const previousStock = variant.stock;
    const newStock = Math.max(0, previousStock + data.quantity);
    
    // Determine new stock status
    const stockStatus = this.determineStockStatus(newStock, variant.lowStockThreshold);

    // Update variant stock and status
    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        stock: newStock,
        stockStatus,
        ...(data.type === 'RESTOCK' && { lastRestocked: new Date() }),
      },
    });

    // Log the inventory movement
    await prisma.inventoryLog.create({
      data: {
        variantId,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason,
        reference: data.reference,
        previousStock,
        newStock,
        userId,
        notes: data.notes,
      },
    });

    return updatedVariant;
  }

  static async getInventoryReport(query: InventoryQuery) {
    const { page, limit, status, productId } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { stockStatus: status }),
      ...(productId && { productId }),
    };

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, slug: true }
          }
        },
        orderBy: { stock: 'asc' },
        skip,
        take: limit,
      }),
      prisma.productVariant.count({ where })
    ]);

    return {
      variants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async getLowStockAlerts() {
    const variants = await prisma.productVariant.findMany({
      where: {
        OR: [
          { stockStatus: 'LOW_STOCK' },
          { stockStatus: 'OUT_OF_STOCK' }
        ],
        isActive: true,
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { stock: 'asc' },
    });

    return variants;
  }

  static async getInventoryLogs(variantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where: { variantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inventoryLog.count({ where: { variantId } })
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async updateLowStockThreshold(variantId: string, data: LowStockThresholdData) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw new NotFoundError('Product variant not found');
    }

    // Update threshold and recalculate status
    const stockStatus = this.determineStockStatus(variant.stock, data.threshold);

    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        lowStockThreshold: data.threshold,
        stockStatus,
      },
    });

    return updatedVariant;
  }

  static async processOrderStock(orderItems: Array<{ variantId: string; quantity: number }>, orderId: string) {
    for (const item of orderItems) {
      await this.updateStock(item.variantId, {
        quantity: -item.quantity,
        type: 'SALE',
        reason: 'Order placed',
        reference: orderId,
      });
    }
  }

  static async processOrderReturn(orderItems: Array<{ variantId: string; quantity: number }>, orderId: string) {
    for (const item of orderItems) {
      await this.updateStock(item.variantId, {
        quantity: item.quantity,
        type: 'RETURN',
        reason: 'Order returned',
        reference: orderId,
      });
    }
  }

  private static determineStockStatus(stock: number, lowStockThreshold: number): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' {
    if (stock === 0) return 'OUT_OF_STOCK';
    if (stock <= lowStockThreshold) return 'LOW_STOCK';
    return 'IN_STOCK';
  }
}

export const inventoryService = InventoryService;
