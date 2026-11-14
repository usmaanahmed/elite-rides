// One saved image of an airport
export type AirportImage = {
  // Name of the file on the server, used to tell the server which image to remove
  fileName: string
  // Full link the <img> tag can load
  url: string
}

// An airport as saved on the server
export type Airport = {
  id: string
  name: string
  description: string
  // Address chosen from Google suggestions
  address: string
  images: AirportImage[]
}

// An airport ready to be sent to the server
export type NewAirport = {
  name: string
  description: string
  address: string
  // Images picked from the computer (new files only)
  newImages: File[]
  // File names of saved images to delete (only used when editing)
  removedImages: string[]
}

// The values exactly as they sit in the Airport form
export type AirportFormValues = {
  name: string
  description: string
  address: string
  // Saved images that are kept (the admin can remove some of them)
  existingImages: AirportImage[]
  // Newly picked images that are not uploaded yet
  newImages: File[]
}

// Which images the filter bar shows
export type AirportImagesFilter = 'all' | 'with-images' | 'without-images'

// The values in the filter bar above the table
export type AirportFilterValues = {
  name: string
  address: string
  images: AirportImagesFilter
}
