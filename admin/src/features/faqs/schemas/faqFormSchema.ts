import { z } from 'zod'

export const QUESTION_MAX_LENGTH = 300
export const ANSWER_MAX_LENGTH = 3000

// The rules for the Add / Edit FAQ form (same limits as the server)
export const faqFormSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Enter the question')
    .min(5, 'Question must be at least 5 characters')
    .max(QUESTION_MAX_LENGTH, `Question must be ${QUESTION_MAX_LENGTH} characters or fewer`),

  answer: z
    .string()
    .trim()
    .min(1, 'Enter the answer')
    .min(2, 'Answer must be at least 2 characters')
    .max(ANSWER_MAX_LENGTH, `Answer must be ${ANSWER_MAX_LENGTH} characters or fewer`),
})
