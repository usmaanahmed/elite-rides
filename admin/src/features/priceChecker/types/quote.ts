export type TripType = 'one_way' | 'return' | 'hourly'

// The values exactly as they sit in the Price Checker form (numbers stay text while typing)
export type PriceCheckerFormValues = {
  tripType: TripType
  pickup: string
  // One stop per line
  via: string
  dropoff: string
  // "YYYY-MM-DD" and "HH:mm" from the pickers
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  hourlyDuration: string
  passengers: string
  babySeats: string
  boosterSeats: string
  extraLuggage: string
  specialLuggage: string
  meetAndGreet: boolean
  wheelchair: boolean
  pet: boolean
  couponCode: string
}

// What is sent to the server to get a quote
export type QuoteRequest = {
  tripType: TripType
  pickup: string
  via: string[]
  dropoff: string
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  hourlyDuration: number
  passengers: number
  extras: {
    babySeats: number
    boosterSeats: number
    meetAndGreet: boolean
    extraLuggage: number
    specialLuggage: number
    wheelchair: boolean
    pet: boolean
  }
  couponCode: string
  vehicleId: string
}

// One line of a price breakdown. Discounts are negative.
export type QuoteLine = {
  label: string
  amount: number
}

// The quote for one vehicle
export type VehicleQuote = {
  vehicleId: string
  vehicleName: string
  available: boolean
  // Why there is no price, when available is false
  unavailableReason: string
  lines: QuoteLine[]
  total: number
}

export type Quote = {
  tripType: TripType
  distanceMiles: number
  currency: string
  couponCode: string
  vehicles: VehicleQuote[]
}
