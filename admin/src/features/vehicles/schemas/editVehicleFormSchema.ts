import { z } from 'zod'
import {
  ALLOWED_IMAGE_TYPES,
  DESCRIPTION_MAX_LENGTH,
  MAX_IMAGE_SIZE_MB,
  percentageField,
  wholeNumberField,
} from './vehicleFormSchema'

const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

// Same as the Add Vehicle form, but the image is optional (null keeps the
// vehicle's current photo) and display order can be changed.
export const editVehicleFormSchema = z.object({
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

  displayOrder: wholeNumberField('display order', 1, 999),

  carImage: z
    .instanceof(File)
    .nullable()
    .refine((file) => file === null || ALLOWED_IMAGE_TYPES.includes(file.type), 'Use a JPG, PNG or WEBP image')
    .refine((file) => file === null || file.size <= MAX_IMAGE_SIZE_BYTES, `Image must be ${MAX_IMAGE_SIZE_MB} MB or smaller`),
})
