import { prisma } from '../../shared/lib/prisma.js';
import type { CreateQuestion, CreateAnswer } from './schema.js';
import { NotFoundError } from '../../shared/errors/index.js';

/**
 * Service for managing product Q&A
 */
export class QuestionService {
  /**
   * Get approved questions for a product
   */
  async getProductQuestions(productId: string) {
    const questions = await prisma.productQuestion.findMany({
      where: {
        productId: productId,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return questions;
  }

  /**
   * Add a new question for a product
   */
  async addQuestion(productId: string, userId: string, data: CreateQuestion) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    return await prisma.productQuestion.create({
      data: {
        productId: productId,
        userId: userId,
        question: data.question,
        isApproved: false, // Requires moderation
      },
    });
  }

  /**
   * Add an answer to a question
   */
  async addAnswer(questionId: string, userId: string, data: CreateAnswer, isStaff = false) {
    const question = await prisma.productQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundError('Question');
    }

    return await prisma.productAnswer.create({
      data: {
        questionId: questionId,
        userId: userId,
        answer: data.answer,
        isStaffReply: isStaff,
      },
    });
  }
}

export const questionService = new QuestionService();
