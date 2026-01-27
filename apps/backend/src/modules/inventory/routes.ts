import type { FastifyInstance } from 'fastify';
import { inventoryService } from './service.js';
import { updateStockSchema, inventoryQuerySchema, lowStockThresholdSchema } from './schema.js';
import { success } from '../../shared/utils/response.js';
import { authenticate } from '../../shared/middleware/auth.js';

export const inventoryRoutes = async (fastify: FastifyInstance) => {
  // POST /admin/inventory/:variantId/stock - Update stock
  fastify.post(
    '/admin/inventory/:variantId/stock',
    {
      preHandler: authenticate,
      schema: {
        params: {
          type: 'object',
          properties: {
            variantId: { type: 'string', format: 'uuid' }
          },
          required: ['variantId']
        }
      }
    },
    async (request: any) => {
      if (request.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const { variantId } = request.params;
      const data = updateStockSchema.parse(request.body);
      const variant = await inventoryService.updateStock(variantId, data, request.user.id);
      return success(variant);
    }
  );

  // GET /admin/inventory/report - Get inventory report
  fastify.get(
    '/admin/inventory/report',
    {
      preHandler: authenticate,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100 },
            status: { type: 'string', enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'] },
            productId: { type: 'string', format: 'uuid' }
          }
        }
      }
    },
    async (request: any) => {
      if (request.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const query = inventoryQuerySchema.parse(request.query);
      const report = await inventoryService.getInventoryReport(query);
      return success(report);
    }
  );

  // GET /admin/inventory/alerts - Get low stock alerts
  fastify.get(
    '/admin/inventory/alerts',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get low stock alerts for inventory management',
        tags: ['Inventory'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Low stock alerts',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    sku: { type: 'string' },
                    name: { type: 'string' },
                    stock: { type: 'number' },
                    lowStockThreshold: { type: 'number' },
                    stockStatus: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        slug: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (request: any) => {
      if (request.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const alerts = await inventoryService.getLowStockAlerts();
      return success(alerts);
    }
  );

  // GET /admin/inventory/:variantId/logs - Get inventory logs
  fastify.get(
    '/admin/inventory/:variantId/logs',
    {
      preHandler: authenticate,
      schema: {
        params: {
          type: 'object',
          properties: {
            variantId: { type: 'string', format: 'uuid' }
          },
          required: ['variantId']
        },
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100 }
          }
        }
      }
    },
    async (request: any) => {
      if (request.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const { variantId } = request.params;
      const { page = 1, limit = 20 } = request.query as any;
      const logs = await inventoryService.getInventoryLogs(variantId, page, limit);
      return success(logs);
    }
  );

  // PATCH /admin/inventory/:variantId/threshold - Update low stock threshold
  fastify.patch(
    '/admin/inventory/:variantId/threshold',
    {
      preHandler: authenticate,
      schema: {
        params: {
          type: 'object',
          properties: {
            variantId: { type: 'string', format: 'uuid' }
          },
          required: ['variantId']
        }
      }
    },
    async (request: any) => {
      if (request.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const { variantId } = request.params;
      const data = lowStockThresholdSchema.parse(request.body);
      const variant = await inventoryService.updateLowStockThreshold(variantId, data);
      return success(variant);
    }
  );
};
