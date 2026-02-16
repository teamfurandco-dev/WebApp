import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import { paymentService } from './service.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';
import { isRazorpayConfigured, RAZORPAY_KEY_ID } from '../../config/razorpay.js';

export const createPaymentOrderSchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.string().default('INR'),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid().optional(),
  customerNotes: z.string().optional(),
});

export async function paymentRoutes(fastify: FastifyInstance) {
  fastify.get('/payments/config', async (request, reply) => {
    return success({
      razorpayConfigured: isRazorpayConfigured(),
      keyId: RAZORPAY_KEY_ID || null
    });
  });

  fastify.post('/payments/create-order', {
    schema: {
      description: 'Create Razorpay order for payment',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          currency: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                razorpayOrderId: { type: 'string' },
                amount: { type: 'number' },
                currency: { type: 'string' },
                keyId: { type: 'string' }
              }
            }
          }
        }
      }
    },
    preHandler: authenticate
  }, async (request: any, reply) => {
    console.log('[Payment Route] Creating order for user:', request.user.id);
    const userId = request.user.id;
    const data = createPaymentOrderSchema.parse(request.body);
    console.log('[Payment Route] Amount:', data.amount);

    try {
      const result = await paymentService.createOrder({
        userId,
        amount: data.amount ?? 0,
        currency: data.currency ?? 'INR'
      });
      console.log('[Payment Route] Order created:', result);

      return success(result);
    } catch (error: any) {
      console.log('[Payment Route] Error:', error.message);
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: error.message || 'Failed to create payment order'
        }
      });
    }
  });

  fastify.post('/payments/verify', {
    schema: {
      description: 'Verify payment and create order',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                order: { type: 'object' },
                alreadyProcessed: { type: 'boolean' }
              }
            }
          }
        }
      }
    },
    preHandler: authenticate
  }, async (request: any, reply) => {
    const userId = request.user.id;
    const data = verifyPaymentSchema.parse(request.body);

    try {
      const result = await paymentService.verifyPaymentAndCreateOrder({
        userId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        shippingAddressId: data.shippingAddressId,
        billingAddressId: data.billingAddressId,
        customerNotes: data.customerNotes
      });

      return success(result);
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: {
          message: error.message || 'Payment verification failed',
          code: 'PAYMENT_FAILED'
        }
      });
    }
  });

  fastify.post('/payments/webhook', {
    schema: {
      description: 'Handle Razorpay webhooks',
      tags: ['Payments']
    }
  }, async (request: any, reply) => {
    const signature = request.headers['x-razorpay-signature'];
    
    if (!signature) {
      return reply.code(400).send({
        success: false,
        error: { message: 'Missing webhook signature' }
      });
    }

    try {
      const payload = JSON.stringify(request.body);
      const result = await paymentService.handleWebhook(payload, signature);
      return success(result);
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      return reply.code(400).send({
        success: false,
        error: { message: error.message }
      });
    }
  });
}
