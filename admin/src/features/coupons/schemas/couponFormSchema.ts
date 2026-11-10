import { z } from 'zod'

const MAX_FIXED_DISCOUNT = 1000
const MAX_PERCENT = 100
export const CODE_MAX_LENGTH = 20

export const couponFormSchema = z
  .object({
    // Checks run in order and only the first failing message is shown.
    // Lowercase letters are turned into uppercase for the user.
    code: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, 'Enter the coupon code')
      .min(3, 'Code must be at least 3 characters')
      .max(CODE_MAX_LENGTH, `Code must be ${CODE_MAX_LENGTH} characters or fewer`)
      .regex(/^[A-Z0-9]+$/, 'Code can only have letters and numbers'),
    discountType: z.enum(['percent', 'fixed']),
    discountValue: z
      .string()
      .trim()
      .min(1, 'Enter the discount')
      .regex(/^\d+(\.\d{1,2})?$/, 'Use a number like 10 or 5.50')
      .refine((value) => Number(value) > 0, 'Must be more than 0')
      .refine((value) => Number(value) <= MAX_FIXED_DISCOUNT, `Cannot be more than ${MAX_FIXED_DISCOUNT}`),
    // Empty = never expires
    expiryDate: z.string(),
    // Empty or 0 = unlimited
    usageLimit: z
      .string()
      .trim()
      .regex(/^\d*$/, 'Use a whole number, or leave empty for unlimited'),
    status: z.enum(['active', 'inactive']),
  })
  .refine((values) => values.discountType !== 'percent' || Number(values.discountValue) <= MAX_PERCENT, {
    message: `Cannot be more than ${MAX_PERCENT}%`,
    path: ['discountValue'],
  })
