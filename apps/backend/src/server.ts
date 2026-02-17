import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config/index.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { authenticate } from './shared/middleware/auth.js';
import { success } from './shared/utils/response.js';
import './shared/types/index.js'; // Ensure FastifyRequest types are extended
import { startDraftCleanupJob } from './jobs/draft-cleanup.job.js';

// Route imports
import { homeRoutes } from './modules/home/routes.js';
import { productRoutes } from './modules/products/routes.js';
import { blogRoutes } from './modules/blogs/routes.js';
import { uploadRoutes } from './modules/uploads/routes.js';
import { cartRoutes } from './modules/cart/routes.js';
import { wishlistRoutes } from './modules/wishlist/routes.js';
import { addressRoutes } from './modules/addresses/routes.js';
import { orderRoutes } from './modules/orders/routes.js';
import { userRoutes } from './modules/users/routes.js';
import { categoryRoutes } from './modules/categories/routes.js';
import { questionRoutes } from './modules/questions/routes.js';
import { reviewRoutes } from './modules/reviews/routes.js';
import { inventoryRoutes } from './modules/inventory/routes.js';
import { profileRoutes } from './modules/profile/routes.js';
import { paymentRoutes } from './modules/payment/routes.js';
import { checkoutRoutes } from './modules/checkout/routes.js';

/**
 * Initialize Fastify instance with production-ready defaults
 */
const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'development' ? 'info' : 'warn',
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          id: request.id,
          ip: request.ip,
        };
      },
    },
  },
  requestIdHeader: 'x-request-id',
});

const start = async () => {
  try {
    fastify.setErrorHandler(errorHandler);

    // Register Swagger
    await fastify.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'Fur & Co API',
          description: 'E-commerce API for pet products with reviews and inventory management',
          version: '1.0.0',
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Development server'
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            }
          }
        }
      }
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => {
        return swaggerObject;
      },
      transformSpecificationClone: true
    });

    await fastify.register(cors, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    });

    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes',
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    });

    fastify.get('/health', {
      schema: {
        description: 'Health check endpoint',
        tags: ['System'],
        response: {
          200: {
            description: 'System health status',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  timestamp: { type: 'string' },
                  environment: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }, async () => {
      return success({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
    });

    fastify.get('/api/me', { preHandler: authenticate }, async (request) => {
      return success({
        user: request.user,
      });
    });

    fastify.get('/api/admin/verify', { preHandler: authenticate }, async (request) => {
      return success({
        isAdmin: request.user?.role?.toLowerCase() === 'admin',
        user: request.user
      });
    });

    const apiPrefix = { prefix: '/api' };
    await fastify.register(homeRoutes, apiPrefix);
    await fastify.register(productRoutes, apiPrefix);
    await fastify.register(blogRoutes, apiPrefix);
    await fastify.register(uploadRoutes, apiPrefix);
    await fastify.register(cartRoutes, apiPrefix);
    await fastify.register(wishlistRoutes, apiPrefix);
    await fastify.register(addressRoutes, apiPrefix);
    await fastify.register(orderRoutes, apiPrefix);
    await fastify.register(userRoutes, apiPrefix);
    await fastify.register(categoryRoutes, apiPrefix);
    await fastify.register(questionRoutes, apiPrefix);
    await fastify.register(reviewRoutes, apiPrefix);
    await fastify.register(inventoryRoutes, apiPrefix);
    await fastify.register(profileRoutes, apiPrefix);
    await fastify.register(paymentRoutes, apiPrefix);
    await fastify.register(checkoutRoutes, apiPrefix);

    try {
      const { default: unlimitedFurRoutes } = await import('./modules/unlimited-fur/routes.js');
      await fastify.register(unlimitedFurRoutes, { prefix: '/api/unlimited-fur' });
      fastify.log.info('✅ Unlimited Fur routes registered');
    } catch (err: any) {
      fastify.log.error(`❌ Failed to register unlimited-fur routes: ${err?.message || 'Unknown error'}`);
    }

    try {
      const { startRenewalJob } = await import('./jobs/renewal.job.js');
      startRenewalJob();
      fastify.log.info('✅ Renewal cron job started');
    } catch (err: any) {
      fastify.log.error(`❌ Failed to start renewal job: ${err?.message || 'Unknown error'}`);
    }

    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${config.port}`);

    // Start draft cleanup job
    startDraftCleanupJob();
    fastify.log.info('✅ Draft cleanup job scheduled');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
