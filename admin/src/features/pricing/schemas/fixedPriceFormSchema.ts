import { z } from 'zod'
import { formatPostcode, UK_POSTCODE_PATTERN } from '../../../shared/utils/formatPostcode'

const MAX_PRICE = 10000

// A UK postcode or postcode area. When valid it is tidied up, e.g. "lu13qf" -> "LU1 3QF".
function postcodeField(fieldName: string) {
  return z
    .string()
    .trim()
    .min(1, `Enter the ${fieldName} postcode`)
    .regex(UK_POSTCODE_PATTERN, 'Enter a UK postcode like LU1 3QF, or an area like LU1')
    .transform(formatPostcode)
}

// A price in pounds, at most 2 decimal places, e.g. "45" or "45.50".
// It may be left blank: that means the vehicle isn't offered on this route.
const optionalPriceSchema = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d+(\.\d{1,2})?$/.test(value), 'Use an amount like 45 or 45.50')
  .refine((value) => value === '' || Number(value) > 0, 'Must be more than £0 (leave blank if not offered)')
  .refine((value) => value === '' || Number(value) <= MAX_PRICE, `Cannot be more than £${MAX_PRICE.toLocaleString()}`)

export const fixedPriceFormSchema = z.object({
  pickupPostcode: postcodeField('pickup'),
  dropoffPostcode: postcodeField('drop-off'),

  prices: z
    .array(
      z.object({
        vehicleTypeId: z.string(),
        amount: optionalPriceSchema,
      }),
    )
    // Every box may be blank on its own, but a route with no prices at all is pointless
    .refine((prices) => prices.some((price) => price.amount !== ''), 'Enter a price for at least one vehicle'),
})
