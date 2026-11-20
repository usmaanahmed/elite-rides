import { z } from 'zod'

// Rules for the passenger details on the tour booking page
export const tourPassengerSchema = z.object({
  // Checks run in order and only the first failing message is shown
  name: z.string().trim().min(1, 'Enter the passenger name').min(2, 'Name is too short').max(100),
  email: z.string().trim().min(1, 'Enter your email address').email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Enter a phone number')
    .regex(/^[0-9+()\-\s]{6,30}$/, 'Enter a valid phone number'),
  pickup: z.string().trim().min(1, 'Enter the pickup address').min(3, 'Pickup address is too short').max(300),
  // Dropdown values are kept as text, the way <select> gives them
  passengers: z.string(),
  luggage: z.string(),
  notes: z.string().trim().max(1000, 'Notes must be 1000 characters or fewer'),
  paymentMethod: z.enum(['pay_card', 'pay_cash'], 'Choose how you want to pay'),
})

export type TourPassengerValues = z.infer<typeof tourPassengerSchema>
