import type { FastifyInstance } from 'fastify';
import { questionService } from './service.js';
import { createQuestionSchema, createAnswerSchema } from './schema.js';
import { uuidSchema } from '../../shared/validation/common.js';
import { success } from '../../shared/utils/response.js';
import { authenticate, optionalAuth } from '../../shared/middleware/auth.js';

/**
 * Product Q&A routes
 */
export const questionRoutes = async (fastify: FastifyInstance) => {
    // GET /products/:productId/questions - Get product Q&A
    fastify.get(
        '/products/:productId/questions',
        {
            preHandler: optionalAuth,
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        productId: { type: 'string', format: 'uuid' }
                    },
                    required: ['productId']
                },
            },
        },
        async (request: any) => {
            const { productId } = request.params as { productId: string };
            const questions = await questionService.getProductQuestions(productId);
            return success(questions);
        }
    );

    // POST /products/:productId/questions - Add question
    fastify.post(
        '/products/:productId/questions',
        {
            preHandler: authenticate,
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        productId: { type: 'string', format: 'uuid' }
                    },
                    required: ['productId']
                },
            },
        },
        async (request: any) => {
            const { productId } = request.params as { productId: string };
            const data = createQuestionSchema.parse(request.body);
            const question = await questionService.addQuestion(
                productId,
                request.user.id,
                data
            );
            return success(question);
        }
    );

    // POST /questions/:questionId/answers - Add answer
    fastify.post(
        '/questions/:questionId/answers',
        {
            preHandler: authenticate,
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        questionId: { type: 'string', format: 'uuid' }
                    },
                    required: ['questionId']
                },
            },
        },
        async (request: any) => {
            const { questionId } = request.params as { questionId: string };
            const data = createAnswerSchema.parse(request.body);
            const answer = await questionService.addAnswer(
                questionId,
                request.user.id,
                data,
                false
            );
            return success(answer);
        }
    );
};
