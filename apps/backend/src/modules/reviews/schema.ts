import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(100).optional(),
  comment: z.string().min(1).max(1000).optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(1).max(100).optional(),
  comment: z.string().min(1).max(1000).optional(),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export type CreateReviewData = z.infer<typeof createReviewSchema>;
export type UpdateReviewData = z.infer<typeof updateReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
