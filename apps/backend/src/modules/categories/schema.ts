import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  image_url: z.string().nullable(),
  parent_id: z.string().uuid().nullable(),
  created_at: z.date(),
});

export type Category = z.infer<typeof categorySchema>;
