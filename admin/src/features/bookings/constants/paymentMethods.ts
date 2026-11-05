import type { PaymentMethod } from '../types/booking'

// What each payment method is called on screen
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pay_card: 'Card',
  pay_cash: 'Cash',
}
