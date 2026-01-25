import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({
  logger: {
    level: 'info',
  },
});

// Register CORS
await fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
});

// Health check endpoint
fastify.get('/health', async () => {
  return {
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }
  };
});

// Basic unlimited-fur endpoint for testing
fastify.post('/api/unlimited-fur/monthly-plans', async () => {
  return {
    success: false,
    error: 'Database not configured yet'
  };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
