import { z } from 'zod';

export const createAddressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(1),
  phone: z.string().min(10),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
  type: z.enum(['shipping', 'billing', 'both']).default('both'),
});

export const updateAddressSchema = createAddressSchema.partial();
