import { z } from 'zod';

export const updateStockSchema = z.object({
  quantity: z.number().int(),
  type: z.enum(['RESTOCK', 'SALE', 'RETURN', 'ADJUSTMENT', 'DAMAGE', 'EXPIRED']),
  reason: z.string().min(1).max(255),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export const inventoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED']).optional(),
  productId: z.string().uuid().optional(),
});

export const lowStockThresholdSchema = z.object({
  threshold: z.number().int().min(0).max(1000),
});

export type UpdateStockData = z.infer<typeof updateStockSchema>;
export type InventoryQuery = z.infer<typeof inventoryQuerySchema>;
export type LowStockThresholdData = z.infer<typeof lowStockThresholdSchema>;
