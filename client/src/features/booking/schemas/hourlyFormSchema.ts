import { z } from 'zod'
import { isDateBeforeToday } from '../utils/isDateBeforeToday'
import { isTimeInPast } from '../utils/isTimeInPast'

// Rules for the "By the hour" tab (chauffeur hired for a number of hours).
// Dropdown values (hours, time, passengers, luggage) are kept as text, the way <select> gives them.
export const hourlyFormSchema = z
  .object({
    pickup: z.string().trim().min(1, 'Enter a pickup location'),
    hours: z.string(),
    pickupDate: z.string().min(1, 'Choose a pickup date'),
    pickupHour: z.string(),
    pickupMinute: z.string(),
    passengers: z.string(),
    luggage: z.string(),
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

export type HourlyFormValues = z.infer<typeof hourlyFormSchema>
