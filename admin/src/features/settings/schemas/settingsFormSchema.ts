import { z } from 'zod'

const MAX_PRICE = 10000

// An amount typed as text, like 5 or 7.50 (empty is not allowed)
const priceField = z
  .string()
  .trim()
  .min(1, 'Enter an amount (0 if none)')
  .regex(/^\d+(\.\d{1,2})?$/, 'Use an amount like 5 or 7.50')
  .refine((value) => Number(value) <= MAX_PRICE, `Cannot be more than £${MAX_PRICE.toLocaleString()}`)

// Empty text, or a full link starting with http:// or https://
function isEmptyOrLink(value: string): boolean {
  if (value === '') return true
  return URL.canParse(value) && (value.startsWith('http://') || value.startsWith('https://'))
}

const optionalLink = z.string().trim().refine(isEmptyOrLink, 'Enter a full link starting with https://')

const discountType = z.enum(['none', 'fixed', 'percent'])

const officeSchema = z.object({
  companyName: z.string().trim().min(1, 'Enter the company name').max(100, 'Must be 100 characters or fewer'),
  appName: z.string().trim().min(1, 'Enter the app name').max(100, 'Must be 100 characters or fewer'),
  currency: z.string().trim().min(1, 'Enter the currency symbol').max(5, 'Must be 5 characters or fewer'),
  companyEmail: z.string().trim().min(1, 'Enter the company email').pipe(z.email('Enter a valid email')),
  fromEmail: z.string().trim().min(1, 'Enter the from email').pipe(z.email('Enter a valid email')),
  siteUrl: optionalLink,
})

// A whole number of miles, e.g. "1" or "20"
const milesField = z
  .string()
  .trim()
  .min(1, 'Enter the miles')
  .regex(/^d+$/, 'Use a whole number, e.g. 20')
  .refine((value) => Number(value) >= 1, 'Must be at least 1')

// A price above £0, e.g. 12.50
const bandPriceField = z
  .string()
  .trim()
  .min(1, 'Enter an amount')
  .regex(/^d+(.d{1,2})?$/, 'Use an amount like 10 or 12.50')
  .refine((value) => Number(value) > 0, 'Must be more than £0')
  .refine((value) => Number(value) <= MAX_PRICE, `Cannot be more than £${MAX_PRICE.toLocaleString()}`)

const mileageBandSchema = z
  .object({ fromMiles: milesField, toMiles: milesField, ratePerMile: bandPriceField })
  .refine((band) => Number(band.toMiles) > Number(band.fromMiles), {
    message: 'Must be more than the from miles',
    path: ['toMiles'],
  })

const slabBandSchema = z
  .object({ fromMiles: milesField, toMiles: milesField, price: bandPriceField })
  .refine((band) => Number(band.toMiles) > Number(band.fromMiles), {
    message: 'Must be more than the from miles',
    path: ['toMiles'],
  })

const pricingSchema = z
  .object({
    mileageBySlabs: z.boolean(),
    roundOff: z.boolean(),
    setPrice: z.enum(['per_vehicle', 'single_price']),
    showCard: z.boolean(),
    singleRates: z.object({
      fixedPrice: priceField,
      // Only the shape is checked here. The band type in use is checked in detail below
      mileageBands: z.array(z.object({ fromMiles: z.string(), toMiles: z.string(), ratePerMile: z.string() })),
      slabBands: z.array(z.object({ fromMiles: z.string(), toMiles: z.string(), price: z.string() })),
    }),
  })
  .superRefine((pricing, context) => {
    // The shared rates are only checked in single price mode, and only the band type in use
    if (pricing.setPrice !== 'single_price') {
      return
    }

    if (pricing.mileageBySlabs) {
      const slabBands = pricing.singleRates.slabBands
      if (slabBands.length === 0) {
        context.addIssue({ code: 'custom', message: 'Add at least one band', path: ['singleRates', 'slabBands'] })
      }
      for (let index = 0; index < slabBands.length; index++) {
        const result = slabBandSchema.safeParse(slabBands[index])
        if (!result.success) {
          for (const issue of result.error.issues) {
            context.addIssue({ code: 'custom', message: issue.message, path: ['singleRates', 'slabBands', index, ...issue.path] })
          }
        }
      }
      return
    }

    const mileageBands = pricing.singleRates.mileageBands
    if (mileageBands.length === 0) {
      context.addIssue({ code: 'custom', message: 'Add at least one band', path: ['singleRates', 'mileageBands'] })
    }
    for (let index = 0; index < mileageBands.length; index++) {
      const result = mileageBandSchema.safeParse(mileageBands[index])
      if (!result.success) {
        for (const issue of result.error.issues) {
          context.addIssue({ code: 'custom', message: issue.message, path: ['singleRates', 'mileageBands', index, ...issue.path] })
        }
      }
    }
  })

const extrasSchema = z.object({
  babySeatPrice: priceField,
  boosterSeatPrice: priceField,
  meetAndGreetPrice: priceField,
  luggagePrice: priceField,
  specialLuggagePrice: priceField,
  wheelchairPrice: priceField,
  petPrice: priceField,
  returnExtraPrice: priceField,
  waitingPricePer5Minutes: priceField,
  viaPrice: priceField,
})

const generalSchema = z
  .object({
    guestLogin: z.boolean(),
    hourlyRateStatus: z.boolean(),
    isQuotation: z.boolean(),
    graceTimeMinutes: z
      .string()
      .trim()
      .regex(/^\d+$/, 'Enter whole minutes (0 if none)')
      .refine((value) => Number(value) <= 1440, 'Cannot be more than 1440 minutes'),
    maxPassengers: z
      .string()
      .trim()
      .regex(/^\d+$/, 'Enter a whole number')
      .refine((value) => Number(value) >= 1 && Number(value) <= 100, 'Must be between 1 and 100'),
    bookingNumberPrefix: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{1,10}$/, 'Use 1 to 10 letters or numbers'),
    blockDateFrom: z.string(),
    blockDateTo: z.string(),
    blockTimeFrom: z.string(),
    blockTimeTo: z.string(),
    bookingSuccessRedirectUrl: optionalLink,
  })
  .refine((general) => (general.blockDateFrom === '') === (general.blockDateTo === ''), {
    message: 'Fill both block dates, or leave both empty',
    path: ['blockDateTo'],
  })
  .refine((general) => general.blockDateFrom === '' || general.blockDateFrom <= general.blockDateTo, {
    message: 'End date must be on or after the start date',
    path: ['blockDateTo'],
  })
  .refine((general) => (general.blockTimeFrom === '') === (general.blockTimeTo === ''), {
    message: 'Fill both block times, or leave both empty',
    path: ['blockTimeTo'],
  })

// The discount amount must match its type, e.g. a percentage cannot be over 100
const discountSchema = z
  .object({
    globalDiscountType: discountType,
    globalDiscountValue: z.string().trim().regex(/^(\d+(\.\d{1,2})?)?$/, 'Use an amount like 5 or 7.50'),
    pretendDiscountType: discountType,
    pretendDiscountValue: z.string().trim().regex(/^(\d+(\.\d{1,2})?)?$/, 'Use an amount like 5 or 7.50'),
  })
  .refine((discount) => discount.globalDiscountType === 'none' || Number(discount.globalDiscountValue) > 0, {
    message: 'Enter the discount amount',
    path: ['globalDiscountValue'],
  })
  .refine((discount) => discount.globalDiscountType !== 'percent' || Number(discount.globalDiscountValue) <= 100, {
    message: 'A percentage cannot be more than 100',
    path: ['globalDiscountValue'],
  })
  .refine((discount) => discount.pretendDiscountType === 'none' || Number(discount.pretendDiscountValue) > 0, {
    message: 'Enter the discount amount',
    path: ['pretendDiscountValue'],
  })
  .refine((discount) => discount.pretendDiscountType !== 'percent' || Number(discount.pretendDiscountValue) <= 100, {
    message: 'A percentage cannot be more than 100',
    path: ['pretendDiscountValue'],
  })

export const settingsFormSchema = z.object({
  office: officeSchema,
  pricing: pricingSchema,
  extras: extrasSchema,
  general: generalSchema,
  discount: discountSchema,
})
