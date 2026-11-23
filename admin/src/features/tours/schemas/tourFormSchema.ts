import { z } from 'zod'

export const TITLE_MAX_LENGTH = 100
export const DESCRIPTION_MAX_LENGTH = 2000
export const MAX_PRICE = 100000
// Same limits as the server
export const MAX_IMAGES = 8
export const MAX_IMAGE_SIZE_MB = 2
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const savedImageSchema = z.object({
  fileName: z.string(),
  url: z.string(),
})

export const MAX_DURATION_DAYS = 365
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const placeSchema = z
  .object({
    name: z.string().trim().min(1, 'Search and pick a place').max(200, 'Place name must be 200 characters or fewer'),
    address: z.string(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    description: z.string().trim().max(500, 'Description must be 500 characters or fewer'),
  })
  // The place must come from the Google list, so we know where it is on the map
  .refine((place) => place.lat !== null && place.lng !== null, {
    path: ['name'],
    message: 'Pick the place from the Google list',
  })

const itineraryDaySchema = z.object({
  title: z.string().trim().max(100, 'Day title must be 100 characters or fewer'),
  places: z.array(placeSchema).min(1, 'Add at least one place to this day'),
})

const priceRowSchema = z.object({
  vehicleId: z.string(),
  vehicleName: z.string(),
  price: z.string().trim(),
})

// The rules for the Add / Edit tour form
export const tourFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Enter the tour title')
      .min(2, 'Tour title must be at least 2 characters')
      .max(TITLE_MAX_LENGTH, `Tour title must be ${TITLE_MAX_LENGTH} characters or fewer`),

    description: z
      .string()
      .trim()
      .max(DESCRIPTION_MAX_LENGTH, `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`),

    // Dates are optional
    startDate: z.string().refine((value) => value === '' || DATE_PATTERN.test(value), 'Enter a valid date'),
    endDate: z.string().refine((value) => value === '' || DATE_PATTERN.test(value), 'Enter a valid date'),

    durationDays: z
      .string()
      .trim()
      .min(1, 'Enter the duration in days')
      .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 1, 'Duration must be a whole number of at least 1')
      .refine((value) => Number(value) <= MAX_DURATION_DAYS, `Duration can't be more than ${MAX_DURATION_DAYS} days`),

    itinerary: z.array(itineraryDaySchema),

    prices: z.array(priceRowSchema),

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
  // The end date can't be before the start date
  .refine((values) => values.startDate === '' || values.endDate === '' || values.endDate >= values.startDate, {
    path: ['endDate'],
    message: "End date can't be before the start date",
  })
  // A price box can stay empty (the vehicle is not offered), but a filled one must be a real price
  .superRefine((values, context) => {
    let pricedVehicles = 0

    values.prices.forEach((row, index) => {
      if (row.price === '') {
        return
      }
      const price = Number(row.price)
      if (Number.isNaN(price) || price <= 0) {
        context.addIssue({ code: 'custom', path: ['prices', index, 'price'], message: 'Enter a price more than 0' })
        return
      }
      if (price > MAX_PRICE) {
        context.addIssue({ code: 'custom', path: ['prices', index, 'price'], message: 'Price is too high' })
        return
      }
      pricedVehicles = pricedVehicles + 1
    })

    // At least one vehicle needs a price, or the customer can't book the tour
    if (pricedVehicles === 0) {
      context.addIssue({ code: 'custom', path: ['prices'], message: 'Set a price for at least one vehicle' })
    }
  })
