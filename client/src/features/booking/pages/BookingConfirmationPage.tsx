import { CircleCheck, Clock3 } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { COMPANY } from '../../../shared/constants/company'
import { formatMoney } from '../../../shared/utils/formatMoney'
import { BookingPageLayout } from '../components/BookingPageLayout'
import { PriceBreakdown } from '../components/PriceBreakdown'
import type { ConfirmedBooking } from '../types/publicApi'
import { formatDisplayDate } from '../utils/formatDisplayDate'

// The thank-you page after booking. The booking comes from the page we were sent from;
// after a refresh it is gone (booking details are never loaded by number, so nobody can look up other bookings).
export function BookingConfirmationPage() {
  const location = useLocation()
  const state = location.state as { booking?: ConfirmedBooking } | null
  const booking = state?.booking

  if (!booking) {
    return (
      <BookingPageLayout title="Thank you">
        <div className="rounded-3xl bg-surface p-6 text-sm text-ink">
          <p>Your booking has been received. If you have any questions, call us on {COMPANY.phoneDisplay}.</p>
          <Link to="/" className="mt-4 inline-block font-semibold text-accent-ink hover:text-ink">
            Back to home
          </Link>
        </div>
      </BookingPageLayout>
    )
  }

  // What the heading says depends on the booking's status
  let title = 'Your booking is confirmed'
  let message = 'Your chauffeur is booked. Please keep your booking number for any questions.'
  let isConfirmed = true
  if (booking.status === 'quote_requested') {
    title = 'Your quote request has been sent'
    message = "We'll check your request and contact you to confirm the price and your booking."
    isConfirmed = false
  } else if (booking.status === 'pending') {
    title = 'Your booking has been received'
    message = "We'll confirm it as soon as your payment is complete."
    isConfirmed = false
  }

  // Old bookings made with "pay in car" still show the driver text
  let paymentText = 'Card payment'
  if (booking.paymentMethod === 'pay_cash') {
    paymentText = `Pay ${formatMoney(booking.balanceDue)} to your driver`
  }

  return (
    <BookingPageLayout title="Thank you">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-3xl bg-surface p-6 text-center text-ink sm:p-8">
          {isConfirmed ? (
            <CircleCheck className="mx-auto size-12 text-accent" strokeWidth={1.75} />
          ) : (
            <Clock3 className="mx-auto size-12 text-accent" strokeWidth={1.75} />
          )}
          <h2 className="mt-3 text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted">{message}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Booking number</p>
          <p className="mt-1 text-2xl font-semibold tracking-wide tabular-nums">{booking.bookingNumber}</p>
        </div>

        <div className="rounded-3xl bg-surface p-6 text-sm text-ink">
          <dl className="space-y-2.5">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Passenger</dt>
              <dd className="text-right font-medium">{booking.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Pickup</dt>
              <dd className="text-right font-medium">
                {formatDisplayDate(booking.pickupDate)} at {booking.pickupTime}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">From</dt>
              <dd className="text-right font-medium">{booking.pickup}</dd>
            </div>
            {booking.dropoff && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">To</dt>
                <dd className="text-right font-medium">{booking.dropoff}</dd>
              </div>
            )}
            {booking.tripType === 'return' && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Return</dt>
                <dd className="text-right font-medium">
                  {formatDisplayDate(booking.returnDate)} at {booking.returnTime}
                </dd>
              </div>
            )}
            {booking.tripType === 'hourly' && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Duration</dt>
                <dd className="text-right font-medium">{booking.hourlyDuration} hours</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Vehicle</dt>
              <dd className="text-right font-medium">{booking.vehicleName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Payment</dt>
              <dd className="text-right font-medium">{paymentText}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl bg-surface p-6 text-ink">
          <PriceBreakdown lines={booking.priceLines} total={booking.total} />
        </div>

        <p className="text-center text-sm text-white/60">
          Questions? Call us on{' '}
          <a href={COMPANY.phoneLink} className="font-semibold text-white hover:text-accent-bright">
            {COMPANY.phoneDisplay}
          </a>
        </p>
      </div>
    </BookingPageLayout>
  )
}
