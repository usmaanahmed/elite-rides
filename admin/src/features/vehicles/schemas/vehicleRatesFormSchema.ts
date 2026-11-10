import { z } from 'zod'

const MAX_PRICE = 10000

// A whole number of miles, e.g. "1" or "20"
const milesField = z
  .string()
  .trim()
  .min(1, 'Enter the miles')
  .regex(/^\d+$/, 'Use a whole number, e.g. 20')
  .refine((value) => Number(value) >= 1, 'Must be at least 1')

// A price in pounds, at most 2 decimal places. `min` decides whether £0.00 is allowed.
function priceField(fieldName: string, min: number) {
  return z
    .string()
    .trim()
    .min(1, `Enter the ${fieldName}`)
    .regex(/^\d+(\.\d{1,2})?$/, 'Use an amount like 10 or 12.50')
    .refine((value) => Number(value) >= min, min === 0 ? 'Cannot be negative' : `Must be more than £0`)
    .refine((value) => Number(value) <= MAX_PRICE, `Cannot be more than £${MAX_PRICE.toLocaleString()}`)

}

const mileageBandSchema = z
  .object({
    fromMiles: milesField,
    toMiles: milesField,
    ratePerMile: priceField('rate per mile', 0.01),
  })
  .refine((band) => Number(band.toMiles) > Number(band.fromMiles), {
    message: 'Must be more than the from miles',
    path: ['toMiles'],
  })

const slabBandSchema = z
  .object({
    fromMiles: milesField,
    toMiles: milesField,
    price: priceField('price', 0.01),
  })
  .refine((band) => Number(band.toMiles) > Number(band.fromMiles), {
    message: 'Must be more than the from miles',
    path: ['toMiles'],
  })

export const vehicleRatesFormSchema = z
  .object({
    rateType: z.enum(['mileage', 'slab']),
    fixedPrice: priceField('fixed price', 0),
    hourlyRate: priceField('hourly rate', 0),
    mileageBands: z.array(mileageBandSchema),
    slabBands: z.array(slabBandSchema),
  })
  .superRefine((values, ctx) => {
    if (values.rateType === 'mileage' && values.mileageBands.length === 0) {
      ctx.addIssue({ code: 'custom', message: 'Add at least one mileage band', path: ['mileageBands'] })
    }
    if (values.rateType === 'slab' && values.slabBands.length === 0) {
      ctx.addIssue({ code: 'custom', message: 'Add at least one slab band', path: ['slabBands'] })
    }
  })
