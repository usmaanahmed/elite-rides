import { z } from 'zod'
import { getTodayDateString } from '../../../shared/utils/getTodayDateString'

export const SURCHARGE_PERCENT_MAX = 100

export const surchargeDateFormSchema = z
  .object({
    // Checks run in order and only the first failing message is shown
    surchargePercent: z
      .string()
      .trim()
      .min(1, 'Enter the surcharge percentage')
      .regex(/^\d+(\.\d{1,2})?$/, 'Use a number like 10 or 12.5')
      .refine((value) => Number(value) > 0, 'Must be more than 0%')
      .refine((value) => Number(value) <= SURCHARGE_PERCENT_MAX, `Cannot be more than ${SURCHARGE_PERCENT_MAX}%`),
    // "YYYY-MM-DD" strings sort the same way as the dates they stand for, so they can be compared directly
    date: z
      .string()
      .min(1, 'Choose a date')
      .refine((value) => value >= getTodayDateString(), 'Choose today or a date in the future'),
    fromTime: z.string().min(1, 'Choose a start time'),
    toTime: z.string().min(1, 'Choose an end time'),
  })
  // A window past midnight (e.g. 22:00 to 02:00) is allowed, but a zero-length one isn't
  .refine((values) => values.fromTime === '' || values.fromTime !== values.toTime, {
    message: 'Must be different from the start time',
    path: ['toTime'],
  })
