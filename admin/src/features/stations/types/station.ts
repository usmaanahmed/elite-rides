// One saved image of a station
export type StationImage = {
  // Name of the file on the server, used to tell the server which image to remove
  fileName: string
  // Full link the <img> tag can load
  url: string
}

// A station as saved on the server
export type Station = {
  id: string
  name: string
  description: string
  // Address chosen from Google suggestions
  address: string
  images: StationImage[]
}

// A station ready to be sent to the server
export type NewStation = {
  name: string
  description: string
  address: string
  // Images picked from the computer (new files only)
  newImages: File[]
  // File names of saved images to delete (only used when editing)
  removedImages: string[]
}

// The values exactly as they sit in the Station form
export type StationFormValues = {
  name: string
  description: string
  address: string
  // Saved images that are kept (the admin can remove some of them)
  existingImages: StationImage[]
  // Newly picked images that are not uploaded yet
  newImages: File[]
}

// Which images the filter bar shows
export type StationImagesFilter = 'all' | 'with-images' | 'without-images'

// The values in the filter bar above the table
export type StationFilterValues = {
  name: string
  address: string
  images: StationImagesFilter
}
