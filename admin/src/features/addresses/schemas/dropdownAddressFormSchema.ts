import { z } from 'zod'

const MAX_CHARGE = 1000

// A charge in pounds, at most 2 decimal places, e.g. "0", "5" or "7.50"
function chargeField(fieldName: string) {
  return z
    .string()
    .trim()
    .min(1, `Enter the ${fieldName} charge (use 0 for no charge)`)
    .regex(/^\d+(\.\d{1,2})?$/, 'Use an amount like 5 or 7.50')
    .refine((value) => Number(value) <= MAX_CHARGE, `Cannot be more than £${MAX_CHARGE.toLocaleString()}`)
}

export const dropdownAddressFormSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, 'Enter the address')
    .min(3, 'Address must be at least 3 characters')
    .max(200, 'Address must be 200 characters or fewer'),

  comparableValue: z
    .string()
    .trim()
    .min(1, 'Enter the comparable value')
    .max(100, 'Comparable value must be 100 characters or fewer'),

  pickupCharge: chargeField('pickup'),
  dropoffCharge: chargeField('drop-off'),

  type: z.enum(['address', 'airport', 'station'], 'Choose a type'),
})
