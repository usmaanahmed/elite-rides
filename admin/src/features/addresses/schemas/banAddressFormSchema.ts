import { z } from 'zod'

export const ADDRESS_MAX_LENGTH = 200

export const banAddressFormSchema = z.object({
  // Checks run in order and only the first failing message is shown
  address: z
    .string()
    .trim()
    .min(1, 'Enter the address to ban')
    .max(ADDRESS_MAX_LENGTH, `Address must be ${ADDRESS_MAX_LENGTH} characters or fewer`),
})
