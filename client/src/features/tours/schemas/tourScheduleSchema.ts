import { z } from 'zod'
import { isDateBeforeToday } from '../../booking/utils/isDateBeforeToday'
import { isTimeInPast } from '../../booking/utils/isTimeInPast'

// Rules for the vehicle, tour date and pickup time chosen on the tour page.
// Time dropdowns are kept as text, the way <select> gives them.
export const tourScheduleSchema = z
  .object({
    vehicleId: z.string().min(1, 'Choose a vehicle'),
    tourDate: z.string().min(1, 'Choose the tour date'),
    pickupHour: z.string(),
    pickupMinute: z.string(),
  })
  // The tour can't be on a date that has already gone
  .refine((values) => !isDateBeforeToday(values.tourDate), {
    message: 'Choose today or a later date',
    path: ['tourDate'],
  })
  // If the tour is today, the pickup time must still be ahead of us
  .refine(
    (values) => {
      // A past date is already reported by the check above
      if (isDateBeforeToday(values.tourDate)) {
        return true
      }
      return !isTimeInPast(values.tourDate, values.pickupHour, values.pickupMinute)
    },
    { message: 'This time has already passed', path: ['pickupHour'] },
  )

export type TourScheduleValues = z.infer<typeof tourScheduleSchema>
