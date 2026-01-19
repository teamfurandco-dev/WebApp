import type { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../lib/supabase.js';
import { UnauthorizedError } from '../errors/index.js';

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

    // Attach user to request
    request.user = {
      id: user.id,
      email: user.email!,
      role: user.role,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Token verification failed');
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
