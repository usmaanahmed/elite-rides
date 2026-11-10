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

// A free-text keyword matched against the customer's drop-off address, e.g. "heathrow"
function dropCodeField() {
  return z.string().trim().min(1, 'Enter the drop code').max(50, 'Drop code must be 50 characters or fewer')
}

// A price in pounds, at most 2 decimal places, e.g. "45" or "45.50". Required.
function priceField(fieldName: string) {
  return z
    .string()
    .trim()
    .min(1, `Enter the ${fieldName}`)
    .regex(/^\d+(\.\d{1,2})?$/, 'Use an amount like 45 or 45.50')
    .refine((value) => Number(value) > 0, 'Must be more than £0')
    .refine((value) => Number(value) <= MAX_PRICE, `Cannot be more than £${MAX_PRICE.toLocaleString()}`)
}

// Same as priceField, but blank means "not offered on this route"
const optionalPriceSchema = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d+(\.\d{1,2})?$/.test(value), 'Use an amount like 45 or 45.50')
  .refine((value) => value === '' || Number(value) > 0, 'Must be more than £0 (leave blank if not offered)')
  .refine((value) => value === '' || Number(value) <= MAX_PRICE, `Cannot be more than £${MAX_PRICE.toLocaleString()}`)

// "Add fixed price" form: one route, with a price box for every vehicle
export const fixedPriceFormSchema = z.object({
  pickupPostcode: postcodeField('pickup'),
  dropCode: dropCodeField(),

  prices: z
    .array(
      z.object({
        vehicleId: z.string(),
        amount: optionalPriceSchema,
      }),
    )
    // Every box may be blank on its own, but a route with no prices at all is pointless
    .refine((prices) => prices.some((price) => price.amount !== ''), 'Enter a price for at least one vehicle'),
})

// "Edit fixed price" form: a single row (one route, one vehicle)
export const editFixedPriceFormSchema = z.object({
  pickupPostcode: postcodeField('pickup'),
  dropCode: dropCodeField(),
  vehicleId: z.string().min(1, 'Choose a vehicle'),
  amount: priceField('fare'),
})
