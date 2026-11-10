import { z } from 'zod'

// Rules for the passenger details on the last booking step
export const passengerDetailsSchema = z.object({
  // Checks run in order and only the first failing message is shown
  name: z.string().trim().min(1, 'Enter the passenger name').min(2, 'Name is too short').max(100),
  email: z.string().trim().min(1, 'Enter your email address').email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Enter a phone number')
    .regex(/^[0-9+()\-\s]{6,30}$/, 'Enter a valid phone number'),
  flightNo: z.string().trim().max(30, 'Flight number is too long'),
  arrivalFrom: z.string().trim().max(100, 'Too long'),
  notes: z.string().trim().max(1000, 'Notes must be 1000 characters or fewer'),
  paymentMethod: z.enum(['pay_cash', 'pay_card'], 'Choose how you want to pay'),
})

export type PassengerDetailsValues = z.infer<typeof passengerDetailsSchema>
