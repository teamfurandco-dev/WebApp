import { z } from 'zod';

/**
 * User profile update schema
 */
export const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    avatarUrl: z.string().url().optional(),
    preferences: z.any().optional(), // Using any for flexible JSON storage
});
