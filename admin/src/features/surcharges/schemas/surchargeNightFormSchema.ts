import { z } from 'zod'

const MAX_FIXED_AMOUNT = 1000
const MAX_PERCENT = 100

export const surchargeNightFormSchema = z
  .object({
    // Checks run in order and only the first failing message is shown
    startTime: z.string().min(1, 'Choose a start time'),
    endTime: z.string().min(1, 'Choose an end time'),
    amountType: z.enum(['fixed', 'percent']),
    amount: z
      .string()
      .trim()
      .min(1, 'Enter the surcharge amount')
      .regex(/^\d+(\.\d{1,2})?$/, 'Use a number like 5 or 12.5')
      .refine((value) => Number(value) <= MAX_FIXED_AMOUNT, `Cannot be more than ${MAX_FIXED_AMOUNT}`),
    status: z.enum(['active', 'inactive']),
  })
  .refine((values) => values.amountType !== 'percent' || Number(values.amount) <= MAX_PERCENT, {
    message: `Cannot be more than ${MAX_PERCENT}%`,
    path: ['amount'],
  })
  // A window past midnight (e.g. 22:00 to 06:00) is allowed, but a zero-length one isn't
  .refine((values) => values.startTime === '' || values.startTime !== values.endTime, {
    message: 'Must be different from the start time',
    path: ['endTime'],
  })
