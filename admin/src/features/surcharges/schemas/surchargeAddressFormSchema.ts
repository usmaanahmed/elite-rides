import { z } from 'zod'

export const ADDRESS_MAX_LENGTH = 200

export const surchargeAddressFormSchema = z
  .object({
    // Checks run in order and only the first failing message is shown
    address: z
      .string()
      .trim()
      .min(1, 'Enter the address')
      .min(5, 'Address must be at least 5 characters')
      .max(ADDRESS_MAX_LENGTH, `Address must be ${ADDRESS_MAX_LENGTH} characters or fewer`),
    fromTime: z.string().min(1, 'Choose a start time'),
    toTime: z.string().min(1, 'Choose an end time'),
  })
  // A window past midnight (e.g. 22:00 to 06:00) is allowed, but a zero-length one isn't
  .refine((values) => values.fromTime === '' || values.fromTime !== values.toTime, {
    message: 'Must be different from the start time',
    path: ['toTime'],
  })
