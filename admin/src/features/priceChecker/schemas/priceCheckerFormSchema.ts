import { z } from 'zod'

const wholeNumber = /^\d+$/

// These limits match the server's rules (quote.validation.ts)
const MAX_ADDRESS_LENGTH = 300
const MAX_VIA_STOPS = 5
const MAX_HOURS = 24

// Counts the non-empty lines of the "one stop per line" text
function countViaStops(viaText: string): number {
  let count = 0
  for (const line of viaText.split('\n')) {
    if (line.trim() !== '') {
      count = count + 1
    }
  }
  return count
}

// A whole number that is not bigger than the given maximum (used for extras)
function countUpTo(maximum: number) {
  return z
    .string()
    .trim()
    .regex(wholeNumber, 'Use a whole number')
    .refine((value) => Number(value) <= maximum, `Maximum ${maximum}`)
}

export const priceCheckerFormSchema = z
  .object({
    // Checks run in order and only the first failing message is shown
    tripType: z.enum(['one_way', 'return', 'hourly']),
    pickup: z
      .string()
      .trim()
      .min(1, 'Enter the pickup address')
      .min(3, 'Address is too short')
      .max(MAX_ADDRESS_LENGTH, 'Address is too long'),
    via: z.string(),
    dropoff: z.string().trim().max(MAX_ADDRESS_LENGTH, 'Address is too long'),
    pickupDate: z.string().min(1, 'Choose the pickup date'),
    pickupTime: z.string().min(1, 'Choose the pickup time'),
    returnDate: z.string(),
    returnTime: z.string(),
    hourlyDuration: z.string().trim(),
    passengers: z
      .string()
      .trim()
      .min(1, 'Enter the number of passengers')
      .regex(wholeNumber, 'Use a whole number')
      .refine((value) => Number(value) >= 1, 'At least 1 passenger')
      .refine((value) => Number(value) <= 99, 'Maximum 99 passengers'),
    babySeats: countUpTo(10),
    boosterSeats: countUpTo(10),
    extraLuggage: countUpTo(50),
    specialLuggage: countUpTo(50),
    meetAndGreet: z.boolean(),
    wheelchair: z.boolean(),
    pet: z.boolean(),
    couponCode: z.string().trim().max(20, 'Coupon code is too long'),
  })
  .refine((values) => values.tripType === 'hourly' || values.dropoff.length >= 3, {
    message: 'Enter the dropoff address',
    path: ['dropoff'],
  })
  .refine((values) => values.tripType !== 'hourly' || Number(values.hourlyDuration) > 0, {
    message: 'Enter the hire duration in hours',
    path: ['hourlyDuration'],
  })
  .refine((values) => values.tripType !== 'hourly' || Number(values.hourlyDuration) <= MAX_HOURS, {
    message: `Maximum ${MAX_HOURS} hours`,
    path: ['hourlyDuration'],
  })
  .refine((values) => countViaStops(values.via) <= MAX_VIA_STOPS, {
    message: `Maximum ${MAX_VIA_STOPS} via stops`,
    path: ['via'],
  })
  .refine((values) => values.tripType !== 'return' || values.returnDate !== '', {
    message: 'Choose the return date',
    path: ['returnDate'],
  })
  .refine((values) => values.tripType !== 'return' || values.returnTime !== '', {
    message: 'Choose the return time',
    path: ['returnTime'],
  })
  .refine(
    (values) => {
      if (values.tripType !== 'return' || values.returnDate === '' || values.returnTime === '') {
        return true
      }
      // "YYYY-MM-DD HH:mm" texts compare correctly as plain text
      const pickupMoment = values.pickupDate + ' ' + values.pickupTime
      const returnMoment = values.returnDate + ' ' + values.returnTime
      return returnMoment > pickupMoment
    },
    {
      message: 'The return must be after the pickup',
      path: ['returnTime'],
    },
  )
