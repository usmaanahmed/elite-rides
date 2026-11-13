// The journey the customer entered in the booking card, ready for the server.
// It is saved in the browser while the customer moves through the booking steps.

export type TripType = 'one_way' | 'return' | 'hourly'

export type JourneyDetails = {
  tripType: TripType
  pickup: string
  // Stops on the way (can be empty)
  via: string[]
  // Empty for hourly hire
  dropoff: string
  // "YYYY-MM-DD" and "HH:mm"
  pickupDate: string
  pickupTime: string
  // Only for a return journey, otherwise ""
  returnDate: string
  returnTime: string
  // Only for hourly hire, otherwise 0
  hourlyDuration: number
  passengers: number
  luggage: number
}

// Extras the customer can add on the details step
export type BookingExtras = {
  babySeats: number
  boosterSeats: number
  meetAndGreet: boolean
  extraLuggage: number
  specialLuggage: number
  wheelchair: boolean
  pet: boolean
}

// Everything chosen so far in the booking steps
export type BookingDraft = {
  journey: JourneyDetails
  // The chosen vehicle ("" until step 2)
  vehicleId: string
}
