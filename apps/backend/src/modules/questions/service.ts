import type { PrismaClient } from '@prisma/client';
import type { CreateQuestion, CreateAnswer } from './schema.js';
import { NotFoundError } from '../../shared/errors/index.js';

export class QuestionService {
  constructor(private prisma: PrismaClient) {}

  async getProductQuestions(productId: string) {
    const questions = await this.prisma.product_questions.findMany({
      where: {
        product_id: productId,
        is_approved: true,
      },
      orderBy: { created_at: 'desc' },
      include: {
        product_answers: {
          orderBy: { created_at: 'asc' },
        },
      },
    });

    return questions;
  }

  async addQuestion(productId: string, userId: string, data: CreateQuestion) {
    // Verify product exists
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    return await this.prisma.product_questions.create({
      data: {
        product_id: productId,
        user_id: userId,
        question: data.question,
        is_approved: false, // Requires moderation
      },
    });
  }

  async addAnswer(questionId: string, userId: string, data: CreateAnswer, isStaff = false) {
    // Verify question exists
    const question = await this.prisma.product_questions.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundError('Question');
    }

    return await this.prisma.product_answers.create({
      data: {
        question_id: questionId,
        user_id: userId,
        answer: data.answer,
        is_staff_reply: isStaff,
      },
    });
  }
}
