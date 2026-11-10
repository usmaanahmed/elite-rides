import type { BookingExtras, TripType } from './journey'

// The settings the website needs, from GET /api/public/settings
export type PublicSettings = {
  companyName: string
  currency: string
  maxPassengers: number
  // false = the "By the hour" tab is hidden
  hourlyRateStatus: boolean
  // false = bookings need a customer login
  guestLogin: boolean
  // true = a booking is only a quote request until the office approves it
  isQuotation: boolean
  showPayInCar: boolean
  cardPaymentAvailable: boolean
  extraPrices: {
    babySeatPrice: number
    boosterSeatPrice: number
    meetAndGreetPrice: number
    luggagePrice: number
    specialLuggagePrice: number
    wheelchairPrice: number
  }
  // Shown only as a crossed-out "was" price
  pretendDiscountType: 'none' | 'fixed' | 'percent'
  pretendDiscountValue: number
  // Where to send the customer after booking ("" = our own thank-you page)
  bookingSuccessRedirectUrl: string
}

export type PublicVehicle = {
  id: string
  name: string
  description: string
  passengerCapacity: number
  luggageCapacity: number
  handLuggageCapacity: number
  // e.g. "/uploads/vehicles/car.jpg" (use getFileUrl)
  imageUrl: string
}

// An airport or station the office has saved
export type DropdownAddress = {
  address: string
  type: 'address' | 'airport' | 'station'
}

// What is sent to POST /api/public/quotes
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
  extras: BookingExtras
  couponCode: string
  // "" = every vehicle
  vehicleId: string
}

// One line of a price breakdown. Discounts are negative.
export type PriceLine = {
  label: string
  amount: number
}

export type VehicleQuote = {
  vehicleId: string
  vehicleName: string
  available: boolean
  unavailableReason: string
  lines: PriceLine[]
  total: number
  couponDiscount: number
}

export type Quote = {
  tripType: TripType
  distanceMiles: number
  currency: string
  couponCode: string
  vehicles: VehicleQuote[]
}

export type PaymentMethod = 'pay_card' | 'pay_cash'

// What is sent to POST /api/public/bookings
export type NewBookingRequest = {
  quote: QuoteRequest
  vehicleId: string
  customer: { name: string; email: string; phone: string; customerId: string }
  luggage: number
  flightNo: string
  arrivalFrom: string
  paymentMethod: PaymentMethod
  notes: string
}

// The booking summary the server sends back after booking
export type ConfirmedBooking = {
  bookingNumber: string
  status: 'quote_requested' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
  customerName: string
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
  luggage: number
  vehicleName: string
  distanceMiles: number
  flightNo: string
  arrivalFrom: string
  priceLines: PriceLine[]
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'partially_paid' | 'paid'
  amountPaid: number
  balanceDue: number
  currency: string
}
