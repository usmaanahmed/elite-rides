import { z } from 'zod'

export const DESCRIPTION_MAX_LENGTH = 500
export const MAX_IMAGE_SIZE_MB = 2
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// A text box that must hold a whole number between `min` and `max`, e.g. "4".
// Checks run in order and only the first failing message is shown.
function wholeNumberField(fieldName: string, min: number, max: number) {
  return z
    .string()
    .trim()
    .min(1, `Enter the ${fieldName}`)
    .regex(/^\d+$/, 'Use a whole number, e.g. 4')
    .refine((value) => Number(value) >= min && Number(value) <= max, `Must be between ${min} and ${max}`)
}

// A percentage from 0 to 100 with at most 2 decimal places, e.g. "10" or "12.5"
function percentageField(fieldName: string) {
  return z
    .string()
    .trim()
    .min(1, `Enter the ${fieldName} (use 0 for no discount)`)
    .regex(/^\d+(\.\d{1,2})?$/, 'Use a number like 10 or 12.5')
    .refine((value) => Number(value) <= 100, 'Cannot be more than 100%')
}

export const vehicleFormSchema = z.object({
  carName: z
    .string()
    .trim()
    .min(1, 'Enter the car name')
    .min(2, 'Car name must be at least 2 characters')
    .max(50, 'Car name must be 50 characters or fewer'),

  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`),

  passengerCapacity: wholeNumberField('passenger capacity', 1, 99),
  luggageCapacity: wholeNumberField('luggage capacity', 0, 50),
  handLuggageCapacity: wholeNumberField('hand luggage capacity', 0, 50),

  discountRate: percentageField('discount rate'),
  returnDiscountRate: percentageField('return discount rate'),

  // Starts as null (nothing picked yet), so null is allowed by the type but rejected by the first check
  carImage: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, 'Choose a photo of the car')
    .refine((file) => file === null || ALLOWED_IMAGE_TYPES.includes(file.type), 'Use a JPG, PNG or WEBP image')
    .refine((file) => file === null || file.size <= MAX_IMAGE_SIZE_BYTES, `Image must be ${MAX_IMAGE_SIZE_MB} MB or smaller`),
})
