import { z } from 'zod';

export const productQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  homepageSection: z.string().optional(),
  isFeatured: z.string().transform(val => val === 'true').optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  homepageSection: z.string().optional(),
  displayOrder: z.number().default(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1),
  name: z.string().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional(),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

export const updateVariantSchema = createVariantSchema.partial().omit({ productId: true });

export const createProductImageSchema = z.object({
  productId: z.string().uuid(),
  bucketName: z.string().min(1),
  filePath: z.string().min(1),
  altText: z.string().optional(),
  displayOrder: z.number().default(0),
  isPrimary: z.boolean().default(false),
});
