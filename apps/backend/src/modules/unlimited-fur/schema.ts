import { z } from 'zod';
import { MIN_BUDGET, PET_TYPES, CATEGORIES } from './constants';

export const createDraftSchema = z.object({});

export const updateBudgetSchema = z.object({
  monthlyBudget: z.number().min(MIN_BUDGET, `Budget must be at least ₹${MIN_BUDGET / 100}`),
});

export const updatePetProfileSchema = z.object({
  petType: z.enum(PET_TYPES as [string, ...string[]]),
});

export const updateCategoriesSchema = z.object({
  selectedCategories: z.array(z.enum(CATEGORIES as [string, ...string[]])).min(1, 'Select at least one category'),
});

export const addProductSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

export const removeProductSchema = z.object({
  productId: z.string().uuid(),
});

export const activatePlanSchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.string(),
  billingCycleDay: z.number().int().min(1).max(28),
});

export const editPlanSchema = z.object({
  products: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })),
});

export const checkoutBundleSchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.string(),
});

export const getEligibleProductsSchema = z.object({
  petType: z.enum(PET_TYPES as [string, ...string[]]).optional(),
  categories: z.array(z.string()).optional(),
  budget: z.number().optional(),
});
