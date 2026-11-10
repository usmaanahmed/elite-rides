import { z } from 'zod'

export const bookingCustomerFormSchema = z.object({
  // Checks run in order and only the first failing message is shown
  name: z.string().trim().min(1, 'Enter the passenger name').min(2, 'Name is too short'),
  email: z.string().trim().min(1, 'Enter the email address').email('Enter a valid email address'),
  phone: z.string().trim().min(1, 'Enter the phone number').min(6, 'Phone number is too short'),
  luggage: z.string().trim().regex(/^\d+$/, 'Use a whole number'),
  flightNo: z.string().trim(),
  arrivalFrom: z.string().trim(),
  paymentMethod: z.enum(['pay_card', 'pay_cash']),
  notes: z.string().trim().max(1000, 'Notes must be 1000 characters or fewer'),
})

// The values exactly as they sit in the form
export type BookingCustomerFormValues = z.infer<typeof bookingCustomerFormSchema>
