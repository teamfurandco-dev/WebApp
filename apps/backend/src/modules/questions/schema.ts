import { z } from 'zod';
import { paginationSchema, uuidSchema } from '../../shared/validation/common.js';

// Question schema
export const questionSchema = z.object({
  id: uuidSchema,
  product_id: uuidSchema,
  user_id: uuidSchema,
  question: z.string(),
  is_approved: z.boolean(),
  created_at: z.date(),
});

// Answer schema
export const answerSchema = z.object({
  id: uuidSchema,
  question_id: uuidSchema,
  user_id: uuidSchema,
  answer: z.string(),
  is_staff_reply: z.boolean(),
  created_at: z.date(),
});

// Create question
export const createQuestionSchema = z.object({
  question: z.string().min(10).max(500),
});

// Create answer
export const createAnswerSchema = z.object({
  answer: z.string().min(10).max(1000),
});

export type Question = z.infer<typeof questionSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;
export type CreateAnswer = z.infer<typeof createAnswerSchema>;
