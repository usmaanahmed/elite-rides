// How the passenger pays, exactly as the server sends it
export type PaymentMethod = 'pay_card' | 'pay_cash'

// A customer booking, as the server sends it back
export type Booking = {
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
