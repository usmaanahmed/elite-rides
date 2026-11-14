import { z } from 'zod'

export const NAME_MAX_LENGTH = 100
export const DESCRIPTION_MAX_LENGTH = 1000
export const ADDRESS_MAX_LENGTH = 300
// Same limits as the server
export const MAX_IMAGES = 5
export const MAX_IMAGE_SIZE_MB = 2
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const savedImageSchema = z.object({
  fileName: z.string(),
  url: z.string(),
})

export const airportFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Enter the airport name')
      .min(2, 'Airport name must be at least 2 characters')
      .max(NAME_MAX_LENGTH, `Airport name must be ${NAME_MAX_LENGTH} characters or fewer`),

    description: z
      .string()
      .trim()
      .max(DESCRIPTION_MAX_LENGTH, `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`),

    address: z
      .string()
      .trim()
      .min(1, 'Enter the airport address')
      .max(ADDRESS_MAX_LENGTH, `Address must be ${ADDRESS_MAX_LENGTH} characters or fewer`),

    existingImages: z.array(savedImageSchema),

    newImages: z
      .array(z.instanceof(File))
      .refine((files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)), 'Use JPG, PNG or WEBP images only')
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE_BYTES), `Each image must be ${MAX_IMAGE_SIZE_MB} MB or smaller`),
  })
  // The saved images and the new images together can't go over the limit
  .refine((values) => values.existingImages.length + values.newImages.length <= MAX_IMAGES, {
    path: ['newImages'],
    message: `You can add up to ${MAX_IMAGES} images`,
  })
