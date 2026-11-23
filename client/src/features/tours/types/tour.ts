// One vehicle of a tour with its price, from GET /api/public/tours/:id
export type PublicTourVehicle = {
  vehicleId: string
  vehicleName: string
  description: string
  passengerCapacity: number
  luggageCapacity: number
  handLuggageCapacity: number
  // e.g. "/uploads/vehicles/car.jpg" (use getFileUrl)
  imageUrl: string
  // The fixed price of this tour with this vehicle
  price: number
}

// One place visited on a day of the tour (picked on Google Maps by the office)
export type TourPlace = {
  name: string
  address: string
  // Position on the map. Both 0 means the place has no position (it is left off the map).
  lat: number
  lng: number
  // Short optional note, e.g. "Guided visit, about 2 hours"
  description: string
}

// One day of the tour. The first day in the list is Day 1.
export type TourItineraryDay = {
  // Optional, e.g. "Windsor & Stonehenge"
  title: string
  places: TourPlace[]
}

// One numbered stop of the whole journey (all places of all days, in order).
// The same number is shown in the timeline and on the map.
export type TourStop = {
  stopNumber: number
  dayNumber: number
  place: TourPlace
  isStart: boolean
  isEnd: boolean
}

// A tour the office has saved on the admin panel's "Tours" page, from GET /api/public/tours
export type PublicTour = {
  id: string
  title: string
  description: string
  // e.g. ["/uploads/tours/1700000000-123.jpg"] (use getFileUrl). Can be empty.
  imageUrls: string[]
  // Only the vehicles that have a price for this tour
  vehicles: PublicTourVehicle[]
  // The lowest price of all the vehicles ("From £...")
  startingPrice: number
  // "YYYY-MM-DD", or "" when the tour has no fixed dates
  startDate: string
  endDate: string
  durationDays: number
  // Day by day plan. Can be empty.
  itinerary: TourItineraryDay[]
}

// What the customer chose on the tour page, kept in the browser until the booking is made
export type TourBookingDraft = {
  tourId: string
  vehicleId: string
  // "YYYY-MM-DD" and "HH:mm"
  tourDate: string
  pickupTime: string
}

export type TourPaymentMethod = 'pay_card' | 'pay_cash'

// What is sent to POST /api/public/tour-bookings. The server works out the price itself.
export type NewTourBookingRequest = {
  tourId: string
  vehicleId: string
  tourDate: string
  pickupTime: string
  pickup: string
  passengers: number
  luggage: number
  customer: { name: string; email: string; phone: string; customerId: string }
  paymentMethod: TourPaymentMethod
  notes: string
}
