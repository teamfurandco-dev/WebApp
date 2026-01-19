import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  avatarUrl: z.string().url().optional(),
  preferences: z.record(z.any()).optional(),
});
