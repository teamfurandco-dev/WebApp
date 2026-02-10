import { FastifyInstance } from 'fastify';
import { userService } from './service.js';
import { updateProfileSchema } from './schema.js';
import { authenticate, authenticateAdmin } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';

/**
 * User profile and admin routes
 */
export async function userRoutes(fastify: FastifyInstance) {
  // Get current user profile
  fastify.get('/users/me', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const profile = await userService.getProfile(userId);
    return success(profile);
  });

  // Update profile
  fastify.patch('/users/me', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const data = updateProfileSchema.parse(request.body);
    const profile = await userService.updateProfile(userId, data);
    return success(profile);
  });

  // Get stats
  fastify.get('/users/me/stats', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const stats = await userService.getUserStats(userId);
    return success(stats);
  });

  // Phone Verification Request
  fastify.post('/users/me/phone/verification-request', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { phone } = request.body as { phone: string };

    if (!phone) {
      return reply.code(400).send({ success: false, error: 'Phone number is required' });
    }

    const result = await userService.requestPhoneVerification(userId, phone);
    return success(result);
  });

  // Verify Phone OTP
  fastify.post('/users/me/phone/verify', { preHandler: authenticate }, async (request: any, reply) => {
    const userId = request.user.id;
    const { phone, otp } = request.body as { phone: string; otp: string };

    if (!phone || !otp) {
      return reply.code(400).send({ success: false, error: 'Phone and OTP are required' });
    }

    try {
      const result = await userService.verifyPhone(userId, phone, otp);
      return success(result);
    } catch (error: any) {
      return reply.code(400).send({ success: false, error: error.message });
    }
  });

  // Admin routes
  fastify.get('/users', { preHandler: authenticateAdmin }, async (request, reply) => {
    const users = await userService.getAllUsers();
    return success(users);
  });

  fastify.patch('/users/:userId/role', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { role } = request.body as { role: string };
    const user = await userService.updateUserRole(userId, role);
    return success(user);
  });
}
