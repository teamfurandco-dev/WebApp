import type { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../lib/supabase.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import { userService } from '../../modules/users/service.js';

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Get user from database to get the role
    const dbUser = await userService.getOrCreateUser(
      user.id,
      user.email!,
      user.user_metadata?.name || user.email!.split('@')[0]
    );

    // Attach user to request with database role
    request.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

// Admin authentication - requires admin role
export const authenticateAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // First authenticate the user
  await authenticate(request, reply);
  
  // Check if user has admin role
  if (request.user?.role?.toLowerCase() !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
};

// Optional authentication - doesn't throw if no token
export const optionalAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return; // No token, continue without user
  }

  try {
    await authenticate(request, reply);
  } catch {
    // Ignore auth errors for optional auth
    return;
  }
};
