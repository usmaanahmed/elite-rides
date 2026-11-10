import { z } from 'zod'

// A premium value: a percentage (0-100) when type is "percent", or a price (£) when type is "fixed".
// Checked loosely here; the real limit depends on the type, which the form already enforces via the radio.
const valueField = z
  .string()
  .trim()
  .min(1, 'Enter a value (use 0 for the base vehicle)')
  .regex(/^\d+(\.\d{1,2})?$/, 'Use a number like 10 or 12.50')

export const calculationFormatFormSchema = z.object({
  items: z.array(
    z.object({
      type: z.enum(['percent', 'fixed']),
      value: valueField,
    }),
  ),
})
