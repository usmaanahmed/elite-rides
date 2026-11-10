import { z } from 'zod'

const MAX_FIXED_AMOUNT = 1000
const MAX_PERCENT = 100

export const surchargeDateFormSchema = z
  .object({
    // "YYYY-MM-DD" from the date picker
    date: z.string().min(1, 'Choose a date'),
    amountType: z.enum(['fixed', 'percent']),
    // Checks run in order and only the first failing message is shown
    amount: z
      .string()
      .trim()
      .min(1, 'Enter the surcharge amount')
      .regex(/^\d+(\.\d{1,2})?$/, 'Use a number like 10 or 12.5')
      .refine((value) => Number(value) > 0, 'Must be more than 0')
      .refine((value) => Number(value) <= MAX_FIXED_AMOUNT, `Cannot be more than ${MAX_FIXED_AMOUNT}`),
    // The time window is optional, but both times must be filled in together
    fromTime: z.string(),
    toTime: z.string(),
    status: z.enum(['active', 'inactive']),
  })
  .refine((values) => values.amountType !== 'percent' || Number(values.amount) <= MAX_PERCENT, {
    message: `Cannot be more than ${MAX_PERCENT}%`,
    path: ['amount'],
  })
  .refine((values) => (values.fromTime === '') === (values.toTime === ''), {
    message: 'Fill in both times, or leave both empty for all day',
    path: ['toTime'],
  })
  // A window past midnight (e.g. 22:00 to 02:00) is allowed, but a zero-length one isn't
  .refine((values) => values.fromTime === '' || values.fromTime !== values.toTime, {
    message: 'Must be different from the start time',
    path: ['toTime'],
  })
