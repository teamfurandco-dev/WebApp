import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid().optional(),
  paymentMethod: z.enum(['cod', 'card', 'upi', 'wallet']),
  customerNotes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
});

export const orderQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});
