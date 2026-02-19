import { z } from 'zod';

export const blogQuerySchema = z.object({
  publishStatus: z.enum(['draft', 'published']).optional(),
  isFeatured: z.string().transform(val => val === 'true').optional(),
  homepageSection: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

export const createBlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverBucketName: z.string().optional(),
  coverFilePath: z.string().optional(),
  coverAltText: z.string().optional(),
  authorId: z.string().uuid().optional(),
  publishStatus: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.string().datetime().optional(),
  isFeatured: z.boolean().default(false),
  homepageSection: z.string().optional(),
  displayOrder: z.number().default(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().uuid().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const createBlogImageSchema = z.object({
  blogId: z.string().uuid(),
  bucketName: z.string().min(1),
  filePath: z.string().min(1),
  altText: z.string().optional(),
  caption: z.string().optional(),
  displayOrder: z.number().default(0),
});
