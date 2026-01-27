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
