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
  // true = "Pay by card" (Stripe) can be offered
  cardPaymentAvailable: boolean
  // true = "Pay in car" (pay the driver) can be offered
  cashPaymentAvailable: boolean
  extraPrices: {
    babySeatPrice: number
    boosterSeatPrice: number
    meetAndGreetPrice: number
    luggagePrice: number
    specialLuggagePrice: number
    wheelchairPrice: number
    petPrice: number
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
  // Secret code for the thank-you page link (?ref=...). Not the booking number.
  reference: string
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
  // true = the customer still has to pay by card, so a "Pay now" button is shown
  canPayByCard: boolean
}

// What POST /api/public/bookings sends back
export type CreateBookingResult = {
  booking: ConfirmedBooking
  // Stripe's payment page. "" = no card payment needed now (pay in car, quote request, or Stripe failed)
  checkoutUrl: string
}

// What the "Pay now" request sends back
export type CardCheckout = {
  checkoutUrl: string
}
