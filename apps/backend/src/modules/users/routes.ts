import { FastifyInstance } from 'fastify';
import { userService } from './service.js';
import { updateProfileSchema } from './schema.js';
import { authenticate } from '../../shared/middleware/auth.js';

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
}
