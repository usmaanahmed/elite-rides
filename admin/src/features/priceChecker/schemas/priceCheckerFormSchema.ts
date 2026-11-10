import { z } from 'zod'

const wholeNumber = /^\d+$/

export const priceCheckerFormSchema = z
  .object({
    // Checks run in order and only the first failing message is shown
    tripType: z.enum(['one_way', 'return', 'hourly']),
    pickup: z.string().trim().min(1, 'Enter the pickup address').min(3, 'Address is too short'),
    via: z.string(),
    dropoff: z.string().trim(),
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
      .refine((value) => Number(value) >= 1, 'At least 1 passenger'),
    babySeats: z.string().trim().regex(wholeNumber, 'Use a whole number'),
    boosterSeats: z.string().trim().regex(wholeNumber, 'Use a whole number'),
    extraLuggage: z.string().trim().regex(wholeNumber, 'Use a whole number'),
    specialLuggage: z.string().trim().regex(wholeNumber, 'Use a whole number'),
    meetAndGreet: z.boolean(),
    wheelchair: z.boolean(),
    couponCode: z.string().trim(),
  })
  .refine((values) => values.tripType === 'hourly' || values.dropoff.length >= 3, {
    message: 'Enter the dropoff address',
    path: ['dropoff'],
  })
  .refine((values) => values.tripType !== 'hourly' || Number(values.hourlyDuration) > 0, {
    message: 'Enter the hire duration in hours',
    path: ['hourlyDuration'],
  })
  .refine((values) => values.tripType !== 'return' || values.returnDate !== '', {
    message: 'Choose the return date',
    path: ['returnDate'],
  })
  .refine((values) => values.tripType !== 'return' || values.returnTime !== '', {
    message: 'Choose the return time',
    path: ['returnTime'],
  })
