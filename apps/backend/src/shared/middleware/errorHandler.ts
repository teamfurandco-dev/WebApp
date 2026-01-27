import type { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../errors/index.js';

/**
 * Global error handler for Fastify.
 * Standardizes all error responses and logs them with request context.
 */
export const errorHandler = async (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const requestId = request.id;

  // Log the error with request context for better observability
  request.log.error({
    requestId,
    path: request.url,
    method: request.method,
    userId: (request as any).user?.id,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }
  });

  // Handle Zod validation errors (mostly from request body/query)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        requestId,
        details: error.issues.map((issue: any) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  // Handle custom AppError classes
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        requestId,
        ...(error instanceof ValidationError && { details: error.errors }),
      },
    });
  }

  // Fallback for unexpected internal errors
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
      requestId,
    },
  });
};
