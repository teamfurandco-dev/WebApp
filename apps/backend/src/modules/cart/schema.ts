import { z } from 'zod';

export const addToCartSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0), // 0 to remove
});
