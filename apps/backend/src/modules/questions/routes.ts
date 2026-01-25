import type { FastifyInstance } from 'fastify';
import { QuestionService } from './service.js';
import { createQuestionSchema, createAnswerSchema } from './schema.js';
import { uuidSchema } from '../../shared/validation/common.js';
import { success } from '../../shared/utils/response.js';
import { authenticate, optionalAuth } from '../../shared/middleware/auth.js';

export const questionRoutes = async (fastify: FastifyInstance) => {
  const questionService = new QuestionService(fastify.prisma);

  // GET /api/products/:productId/questions - Get product Q&A
  fastify.get(
    '/api/products/:productId/questions',
    {
      preHandler: optionalAuth,
      schema: {
        params: { productId: uuidSchema },
      },
    },
    async (request) => {
      const { productId } = request.params as { productId: string };
      const questions = await questionService.getProductQuestions(productId);
      return success(questions);
    }
  );

  // POST /api/products/:productId/questions - Add question
  fastify.post(
    '/api/products/:productId/questions',
    {
      preHandler: authenticate,
      schema: {
        params: { productId: uuidSchema },
        body: createQuestionSchema,
      },
    },
    async (request) => {
      const { productId } = request.params as { productId: string };
      const data = createQuestionSchema.parse(request.body);
      const question = await questionService.addQuestion(
        productId,
        request.user!.id,
        data
      );
      return success(question);
    }
  );

  // POST /api/questions/:questionId/answers - Add answer
  fastify.post(
    '/api/questions/:questionId/answers',
    {
      preHandler: authenticate,
      schema: {
        params: { questionId: uuidSchema },
        body: createAnswerSchema,
      },
    },
    async (request) => {
      const { questionId } = request.params as { questionId: string };
      const data = createAnswerSchema.parse(request.body);
      const answer = await questionService.addAnswer(
        questionId,
        request.user!.id,
        data,
        false // Regular user answer
      );
      return success(answer);
    }
  );
};
