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
