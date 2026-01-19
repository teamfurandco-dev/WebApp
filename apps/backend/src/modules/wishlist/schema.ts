import { z } from 'zod';

export const addToWishlistSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
});
