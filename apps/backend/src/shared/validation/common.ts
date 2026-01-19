import { z } from 'zod';

// UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;

// Price validation (in cents)
export const priceSchema = z.number().int().nonnegative();

// Sort order
export const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

// Common query filters
export const searchSchema = z.object({
  search: z.string().optional(),
  sort: z.string().optional(),
  order: sortOrderSchema.optional(),
});

// Date range
export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Helper to create paginated response type
export const createPaginatedResponse = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });
