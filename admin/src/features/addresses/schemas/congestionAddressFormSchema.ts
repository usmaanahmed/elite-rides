import { z } from 'zod'

const MAX_PRICE = 1000

export const congestionAddressFormSchema = z.object({
  // Checks run in order and only the first failing message is shown
  postcode: z
    .string()
    .trim()
    .min(1, 'Enter the postcode')
    .min(2, 'Postcode must be at least 2 characters')
    .max(10, 'Postcode must be 10 characters or fewer')
    .regex(/^[A-Za-z0-9 ]+$/, 'Postcode can only have letters and numbers'),

  price: z
    .string()
    .trim()
    .min(1, 'Enter the congestion charge')
    .regex(/^\d+(\.\d{1,2})?$/, 'Use an amount like 5 or 7.50')
    .refine((value) => Number(value) <= MAX_PRICE, `Cannot be more than £${MAX_PRICE.toLocaleString()}`),
})
