import { z } from 'zod'

const MAX_RATE_PER_HOUR = 1000

export const hourlyRateFormSchema = z.object({
  vehicleTypeId: z.string().min(1, 'Choose a vehicle'),

  // A price in pounds, at most 2 decimal places, e.g. "35" or "35.50".
  // Checks run in order and only the first failing message is shown.
  ratePerHour: z
    .string()
    .trim()
    .min(1, 'Enter the hourly rate')
    .regex(/^\d+(\.\d{1,2})?$/, 'Use an amount like 35 or 35.50')
    .refine((value) => Number(value) > 0, 'Must be more than £0')
    .refine((value) => Number(value) <= MAX_RATE_PER_HOUR, `Cannot be more than £${MAX_RATE_PER_HOUR.toLocaleString()} per hour`),
})
