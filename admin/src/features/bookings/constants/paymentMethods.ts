import type { BookingStatus, PaymentMethod, PaymentStatus } from '../types/booking'

// What each payment method is called on screen
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pay_card: 'Card',
  pay_cash: 'Pay in car',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Unpaid',
  partially_paid: 'Part paid',
  paid: 'Paid',
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  quote_requested: 'Quote requested',
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}
