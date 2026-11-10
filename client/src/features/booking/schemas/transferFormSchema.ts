import { z } from 'zod'
import { buildDateTime } from '../utils/buildDateTime'
import { isDateBeforeToday } from '../utils/isDateBeforeToday'
import { isTimeInPast } from '../utils/isTimeInPast'

// Rules for the "Transfer" tab (A to B, optional stops, optional return journey).
// Dropdown values (time, passengers, luggage) are kept as text, the way <select> gives them.
export const transferFormSchema = z
  .object({
    pickup: z.string().trim().min(1, 'Enter a pickup location'),
    stops: z.array(
      z.object({
        address: z.string().trim().min(1, 'Enter an address for this stop, or remove it'),
      }),
    ),
    dropoff: z.string().trim().min(1, 'Enter a drop-off location'),
    pickupDate: z.string().min(1, 'Choose a pickup date'),
    pickupHour: z.string(),
    pickupMinute: z.string(),
    passengers: z.string(),
    luggage: z.string(),
    hasReturn: z.boolean(),
    returnDate: z.string(),
    returnHour: z.string(),
    returnMinute: z.string(),
  })
  // The pickup can't be on a date that has already gone
  .refine((values) => !isDateBeforeToday(values.pickupDate), {
    message: 'Choose today or a later date',
    path: ['pickupDate'],
  })
  // If the pickup is today, the time must still be ahead of us
  .refine(
    (values) => {
      // A past date is already reported by the check above
      if (isDateBeforeToday(values.pickupDate)) {
        return true
      }
      return !isTimeInPast(values.pickupDate, values.pickupHour, values.pickupMinute)
    },
    { message: 'This time has already passed', path: ['pickupHour'] },
  )
  // A return journey needs its own date
  .refine(
    (values) => {
      if (!values.hasReturn) {
        return true
      }
      return values.returnDate !== ''
    },
    { message: 'Choose a return date', path: ['returnDate'] },
  )
  // The return must be after the outward pickup
  .refine(
    (values) => {
      if (!values.hasReturn || values.returnDate === '') {
        return true
      }
      const pickupTime = buildDateTime(values.pickupDate, values.pickupHour, values.pickupMinute)
      const returnTime = buildDateTime(values.returnDate, values.returnHour, values.returnMinute)
      return returnTime.getTime() > pickupTime.getTime()
    },
    { message: 'Return must be after the pickup', path: ['returnDate'] },
  )

export type TransferFormValues = z.infer<typeof transferFormSchema>
