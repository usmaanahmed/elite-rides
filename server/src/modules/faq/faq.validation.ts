// FAQ ke input ko check karne wali Zod rules
import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().trim().min(5, "Question must be at least 5 characters").max(300, "Question must be 300 characters or fewer"),
  answer: z.string().trim().min(2, "Answer must be at least 2 characters").max(3000, "Answer must be 3000 characters or fewer"),
});
