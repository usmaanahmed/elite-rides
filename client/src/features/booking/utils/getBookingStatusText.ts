import type { ConfirmedBooking } from '../types/publicApi'

// Which icon the thank-you page shows at the top
export type BookingStatusIcon = 'confirmed' | 'waiting' | 'checking' | 'cancelled'

export type BookingStatusText = {
  title: string
  message: string
  icon: BookingStatusIcon
}

// The heading and message of the thank-you page, from the booking's status and payment.
// `isCheckingPayment` is true when the customer has just paid on Stripe but our server hasn't heard yet.
export function getBookingStatusText(booking: ConfirmedBooking, isCheckingPayment: boolean): BookingStatusText {
  if (booking.status === 'cancelled') {
    return {
      title: 'This booking has been cancelled',
      message: 'If you think this is a mistake, please call us.',
      icon: 'cancelled',
    }
  }

  if (booking.status === 'quote_requested') {
    return {
      title: 'Your quote request has been sent',
      message: "We'll check your request and contact you to confirm the price and your booking.",
      icon: 'waiting',
    }
  }

  if (isCheckingPayment) {
    return {
      title: 'Confirming your payment…',
      message:
        "This usually takes a few seconds. Please don't pay again. If this page doesn't update within a minute, refresh it or call us.",
      icon: 'checking',
    }
  }

  if (booking.canPayByCard) {
    return {
      title: 'Your booking is waiting for payment',
      message: "We've saved your booking, but it isn't confirmed until it's paid.",
      icon: 'waiting',
    }
  }

  if (booking.status === 'confirmed' || booking.status === 'completed') {
    return {
      title: 'Your booking is confirmed',
      message: 'Your chauffeur is booked. Please keep your booking number for any questions.',
      icon: 'confirmed',
    }
  }

  return {
    title: 'Your booking has been received',
    message: "We'll confirm it shortly.",
    icon: 'waiting',
  }
}
