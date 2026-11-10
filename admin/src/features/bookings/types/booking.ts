// How the passenger pays, exactly as the server sends it.
// pay_card = card online, pay_cash = pay in the car
export type PaymentMethod = 'pay_card' | 'pay_cash'

export type PaymentStatus = 'pending' | 'partially_paid' | 'paid'

export type BookingStatus = 'quote_requested' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type TripType = 'one_way' | 'return' | 'hourly'

// A short booking used by the dashboard's sample data (it is not loaded from the server yet)
export type BookingSummary = {
  id: string
  // The reference shown to customers, e.g. ELR001663
  orderNo: string
  passengerName: string
  // Local date and time of the pickup, e.g. "2026-03-05T22:00"
  pickupAt: string
  pickupAddress: string
  dropoffAddress: string
  vehicleName: string
  paymentMethod: PaymentMethod
  // In pounds, e.g. 74 means £74.00
  fare: number
}

// One line of the price breakdown. Discounts are negative.
export type PriceLine = {
  label: string
  amount: number
}

export type BookingExtras = {
  babySeats: number
  boosterSeats: number
  meetAndGreet: boolean
  extraLuggage: number
  specialLuggage: number
  wheelchair: boolean
}

// A booking as the server sends it back
export type Booking = {
  id: string
  // The reference shown to customers, e.g. ELR000042
  bookingNumber: string
  status: BookingStatus
  customer: { name: string; email: string; phone: string; customerId: string }
  tripType: TripType
  pickup: string
  via: string[]
  dropoff: string
  // "YYYY-MM-DD" and "HH:mm"
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  hourlyDuration: number
  passengers: number
  luggage: number
  vehicleId: string
  vehicleName: string
  extras: BookingExtras
  flightNo: string
  arrivalFrom: string
  distanceMiles: number
  // The price as it was when the booking was made
  priceLines: PriceLine[]
  // In pounds
  total: number
  couponCode: string
  couponDiscount: number
  waitingMinutes: number
  waitingCharge: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  amountPaid: number
  balanceDue: number
  notes: string
  createdAt: string
}

// The filters above the bookings table. Empty text = no filter.
export type BookingFilters = {
  status: BookingStatus | ''
  paymentStatus: PaymentStatus | ''
  // "YYYY-MM-DD" range of the pickup date
  dateFrom: string
  dateTo: string
}

export type BookingList = {
  items: Booking[]
  total: number
  page: number
  limit: number
}

// What is sent to the server to create a booking
export type NewBooking = {
  quote: {
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
    vehicleId: string
  }
  vehicleId: string
  customer: { name: string; email: string; phone: string; customerId: string }
  luggage: number
  flightNo: string
  arrivalFrom: string
  paymentMethod: PaymentMethod
  notes: string
}
