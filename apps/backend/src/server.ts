import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { config } from './config/index.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { authenticate } from './shared/middleware/auth.js';
import { success } from './shared/utils/response.js';
import { productRoutes } from './modules/products/routes.js';
import { blogRoutes } from './modules/blogs/routes.js';
import { uploadRoutes } from './modules/uploads/routes.js';
import { cartRoutes } from './modules/cart/routes.js';
import { wishlistRoutes } from './modules/wishlist/routes.js';
import { addressRoutes } from './modules/addresses/routes.js';
import { orderRoutes } from './modules/orders/routes.js';
import { userRoutes } from './modules/users/routes.js';

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'development' ? 'info' : 'warn',
  },
});

// Start server
const start = async () => {
  try {
    // Register error handler
    fastify.setErrorHandler(errorHandler);

    // Register CORS
    await fastify.register(cors, {
      origin: config.cors.origin,
      credentials: true,
    });

    // Register rate limiting
    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes',
    });

    // Register multipart for file uploads
    await fastify.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    });

    // Health check endpoint
    fastify.get('/health', async () => {
      return success({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
    });

    // Test protected endpoint
    fastify.get('/api/me', { preHandler: authenticate }, async (request) => {
      return success({
        user: request.user,
      });
    });

    // Register API routes
    await fastify.register(productRoutes, { prefix: '/api' });
    await fastify.register(blogRoutes, { prefix: '/api' });
    await fastify.register(uploadRoutes, { prefix: '/api' });
    await fastify.register(cartRoutes, { prefix: '/api' });
    await fastify.register(wishlistRoutes, { prefix: '/api' });
    await fastify.register(addressRoutes, { prefix: '/api' });
    await fastify.register(orderRoutes, { prefix: '/api' });
    await fastify.register(userRoutes, { prefix: '/api' });
    
    // Import and register unlimited-fur routes (with error handling)
    try {
      const { default: unlimitedFurRoutes } = await import('./modules/unlimited-fur/routes.js');
      await fastify.register(unlimitedFurRoutes, { prefix: '/api/unlimited-fur' });
      console.log('✅ Unlimited Fur routes registered');
    } catch (err) {
      console.error('❌ Failed to register unlimited-fur routes:', err.message);
    }

    // Start renewal cron job (with error handling)
    try {
      const { startRenewalJob } = await import('./jobs/renewal.job.js');
      startRenewalJob();
      console.log('✅ Renewal cron job started');
    } catch (err) {
      console.error('❌ Failed to start renewal job:', err.message);
    }

    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
