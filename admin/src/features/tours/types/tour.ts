// One saved image of a tour
export type TourImage = {
  // Name of the file on the server, used to tell the server which image to remove
  fileName: string
  // Full link the <img> tag can load
  url: string
}

// The price of one vehicle for a tour, as saved on the server
export type TourPrice = {
  vehicleId: string
  price: number
}

// One place visited on a day of the itinerary (picked from Google Maps)
export type TourPlace = {
  name: string
  address: string
  lat: number
  lng: number
  description: string
}

// One day of the itinerary (Day 1 is the first in the list)
export type TourItineraryDay = {
  title: string
  places: TourPlace[]
}

// A tour as saved on the server
export type TourItem = {
  id: string
  title: string
  description: string
  // "YYYY-MM-DD", or "" when no date is set
  startDate: string
  endDate: string
  durationDays: number
  itinerary: TourItineraryDay[]
  prices: TourPrice[]
  images: TourImage[]
}

// A tour ready to be sent to the server
export type NewTour = {
  title: string
  description: string
  startDate: string
  endDate: string
  durationDays: number
  itinerary: TourItineraryDay[]
  // Only the vehicles that have a price
  prices: TourPrice[]
  // Images picked from the computer (new files only)
  newImages: File[]
  // File names of saved images to delete (only used when editing)
  removedImages: string[]
}

// One vehicle row in the tour form. The price is kept as text while the admin types ("" = this vehicle is not offered).
export type TourPriceFormValue = {
  vehicleId: string
  vehicleName: string
  price: string
}

// One place in the tour form. lat / lng stay null until the admin picks the place from the Google list.
export type TourPlaceFormValue = {
  name: string
  address: string
  lat: number | null
  lng: number | null
  description: string
}

// One day in the tour form
export type TourItineraryDayFormValue = {
  title: string
  places: TourPlaceFormValue[]
}

// The values exactly as they sit in the Tour form
export type TourFormValues = {
  title: string
  description: string
  startDate: string
  endDate: string
  // Kept as text while the admin types
  durationDays: string
  itinerary: TourItineraryDayFormValue[]
  // One row for every vehicle that exists
  prices: TourPriceFormValue[]
  // Saved images that are kept (the admin can remove some of them)
  existingImages: TourImage[]
  // Newly picked images that are not uploaded yet
  newImages: File[]
}
