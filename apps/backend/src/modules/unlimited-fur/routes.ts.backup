import { FastifyInstance } from 'fastify';
import { MonthlyPlanService } from './monthly-plan.service.js';
import { BundleService } from './bundle.service.js';
import { ProductFilterService } from './product-filter.service.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';
import {
  createDraftSchema,
  updateBudgetSchema,
  updatePetProfileSchema,
  updateCategoriesSchema,
  addProductSchema,
  removeProductSchema,
  activatePlanSchema,
  editPlanSchema,
  checkoutBundleSchema,
  getEligibleProductsSchema,
} from './schema.js';

const monthlyPlanService = new MonthlyPlanService();
const bundleService = new BundleService();
const productFilterService = new ProductFilterService();

export default async function unlimitedFurRoutes(fastify: FastifyInstance) {
  // Monthly Plan Routes
  fastify.post('/monthly-plan/draft', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const plan = await monthlyPlanService.createDraft(userId);
    return success(plan);
  });

  fastify.put('/monthly-plan/:id/budget', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { monthlyBudget } = updateBudgetSchema.parse(request.body);
    const plan = await monthlyPlanService.updateBudget(id, userId, monthlyBudget);
    return success(plan);
  });

  fastify.put('/monthly-plan/:id/pet-profile', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { petType } = updatePetProfileSchema.parse(request.body);
    const plan = await monthlyPlanService.updatePetProfile(id, userId, petType);
    return success(plan);
  });

  fastify.put('/monthly-plan/:id/categories', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { selectedCategories } = updateCategoriesSchema.parse(request.body);
    const plan = await monthlyPlanService.updateCategories(id, userId, selectedCategories);
    return success(plan);
  });

  fastify.post('/monthly-plan/:id/products', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { productId, variantId, quantity } = addProductSchema.parse(request.body);
    const product = await monthlyPlanService.addProduct(id, userId, productId, variantId, quantity);
    return success(product);
  });

  fastify.delete('/monthly-plan/:id/products/:productId', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id, productId } = request.params as { id: string; productId: string };
    const result = await monthlyPlanService.removeProduct(id, userId, productId);
    return success(result);
  });

  fastify.get('/monthly-plan/:id/wallet', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const wallet = await monthlyPlanService.calculateWallet(id, userId);
    return success(wallet);
  });

  fastify.post('/monthly-plan/:id/activate', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { addressId, paymentMethod, billingCycleDay } = activatePlanSchema.parse(request.body);
    const result = await monthlyPlanService.activatePlan(id, userId, addressId, paymentMethod, billingCycleDay);
    return success(result);
  });

  fastify.get('/monthly-plan/active', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const plan = await monthlyPlanService.getActivePlan(userId);
    return success(plan);
  });

  fastify.put('/monthly-plan/:id/edit', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { products } = editPlanSchema.parse(request.body);
    const plan = await monthlyPlanService.editPlan(id, userId, products);
    return success(plan);
  });

  fastify.put('/monthly-plan/:id/pause', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const plan = await monthlyPlanService.pausePlan(id, userId);
    return success(plan);
  });

  fastify.put('/monthly-plan/:id/cancel', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const plan = await monthlyPlanService.cancelPlan(id, userId);
    return success(plan);
  });

  // Bundle Routes
  fastify.post('/bundle/draft', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const bundle = await bundleService.createDraft(userId);
    return success(bundle);
  });

  fastify.put('/bundle/:id/budget', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { monthlyBudget: bundleBudget } = updateBudgetSchema.parse(request.body);
    const bundle = await bundleService.updateBudget(id, userId, bundleBudget);
    return success(bundle);
  });

  fastify.put('/bundle/:id/pet-profile', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { petType } = updatePetProfileSchema.parse(request.body);
    const bundle = await bundleService.updatePetProfile(id, userId, petType);
    return success(bundle);
  });

  fastify.put('/bundle/:id/categories', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { selectedCategories } = updateCategoriesSchema.parse(request.body);
    const bundle = await bundleService.updateCategories(id, userId, selectedCategories);
    return success(bundle);
  });

  fastify.post('/bundle/:id/products', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { productId, variantId, quantity } = addProductSchema.parse(request.body);
    const bundle = await bundleService.addProduct(id, userId, productId, variantId, quantity);
    return success(bundle);
  });

  fastify.delete('/bundle/:id/products/:productId', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id, productId } = request.params as { id: string; productId: string };
    const result = await bundleService.removeProduct(id, userId, productId);
    return success(result);
  });

  fastify.get('/bundle/:id/wallet', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const wallet = await bundleService.calculateWallet(id, userId);
    return success(wallet);
  });

  fastify.post('/bundle/:id/checkout', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { id } = request.params as { id: string };
    const { addressId, paymentMethod } = checkoutBundleSchema.parse(request.body);
    const result = await bundleService.checkout(id, userId, addressId, paymentMethod);
    return success(result);
  });

  // Product Routes
  fastify.get('/products', { preHandler: authenticate }, async (request: any, reply) => {
    const { petType, categories, budget } = getEligibleProductsSchema.parse(request.query);
    const products = await productFilterService.getEligibleProducts(petType, categories, budget);
    return success(products);
  });
}
