import { FastifyInstance } from 'fastify';
import { userService } from './service.js';
import { updateProfileSchema } from './schema.js';
import { authenticate, authenticateAdmin } from '../../shared/middleware/auth.js';

export async function userRoutes(fastify: FastifyInstance) {
  // Get current user profile
  fastify.get('/users/me', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const profile = await userService.getProfile(userId);
    return { data: profile };
  });
  
  // Update profile
  fastify.patch('/users/me', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const data = updateProfileSchema.parse(request.body);
    const profile = await userService.updateProfile(userId, data);
    return { data: profile };
  });
  
  // Get user stats
  fastify.get('/users/me/stats', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const stats = await userService.getUserStats(userId);
    return { data: stats };
  });

  // Admin routes
  // Get all users (admin only)
  fastify.get('/users', { preHandler: authenticateAdmin }, async (request, reply) => {
    const users = await userService.getAllUsers();
    return { data: users };
  });

  // Update user role (admin only)
  fastify.patch('/users/:userId/role', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { role } = request.body as { role: string };
    
    if (!['customer', 'admin'].includes(role)) {
      return reply.code(400).send({ error: 'Invalid role' });
    }

    const user = await userService.updateUserRole(userId, role);
    return { data: user };
  });
}
