import { CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { COMPANY } from '../../../shared/constants/company'
import { formatMoney } from '../../../shared/utils/formatMoney'
import { BookingPageLayout } from '../components/BookingPageLayout'
import { BookingStatusCard } from '../components/BookingStatusCard'
import { ConfirmationDetailsList } from '../components/ConfirmationDetailsList'
import { PriceBreakdown } from '../components/PriceBreakdown'
import { useBookingByReference, usePublicSettings, useStartCardPayment } from '../hooks/usePublicData'
import { buildSuccessRedirectUrl } from '../utils/buildSuccessRedirectUrl'
import { getBookingStatusText } from '../utils/getBookingStatusText'

// The thank-you page. The link has the booking's secret code (?ref=...), so the page can be
// refreshed or bookmarked, and Stripe sends the customer back here after paying (&payment=done or cancelled).
export function BookingConfirmationPage() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('ref') || ''
  // "done" = just paid on Stripe, "cancelled" = left Stripe without paying, "" = not coming from Stripe
  const paymentResult = searchParams.get('payment') || ''
  const hasJustPaid = paymentResult === 'done'

  const bookingQuery = useBookingByReference(reference, hasJustPaid)
  const settingsQuery = usePublicSettings()
  const startPayment = useStartCardPayment()
  // True while the browser is on its way to Stripe's payment page
  const [isOpeningPayment, setIsOpeningPayment] = useState(false)

  const booking = bookingQuery.data
  const settings = settingsQuery.data

  // After a card payment, the office's own "thank you" page (if set) is shown once the payment is confirmed
  useEffect(() => {
    if (!booking || !settings || !hasJustPaid || booking.canPayByCard) {
      return
    }
    if (settings.bookingSuccessRedirectUrl === '') {
      return
    }
    const redirectUrl = buildSuccessRedirectUrl(settings.bookingSuccessRedirectUrl, booking)
    if (redirectUrl) {
      window.location.assign(redirectUrl)
    }
  }, [booking, settings, hasJustPaid])

  if (reference === '') {
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

  if (bookingQuery.isPending) {
    return (
      <BookingPageLayout title="Your booking">
        <div className="mx-auto max-w-2xl rounded-3xl bg-surface p-6 text-sm text-muted">Loading your booking…</div>
      </BookingPageLayout>
    )
  }

  if (bookingQuery.isError) {
    return (
      <BookingPageLayout title="Your booking">
        <div className="mx-auto max-w-2xl rounded-3xl bg-surface p-6 text-sm text-ink">
          <p className="font-semibold">We couldn't find this booking</p>
          <p className="mt-1 text-muted">
            Please check the link, or call us on {COMPANY.phoneDisplay} with your booking number.
          </p>
        </div>
      </BookingPageLayout>
    )
  }

  const loadedBooking = bookingQuery.data
  // Paid on Stripe, but our server hasn't been told yet: don't offer to pay again
  const isCheckingPayment = hasJustPaid && loadedBooking.canPayByCard
  const statusText = getBookingStatusText(loadedBooking, isCheckingPayment)
  const showPayButton = loadedBooking.canPayByCard && !isCheckingPayment

  function handlePayNow(): void {
    startPayment.mutate(reference, {
      onSuccess: (result) => {
        setIsOpeningPayment(true)
        window.location.assign(result.checkoutUrl)
      },
    })
  }

  let payButtonLabel = `Pay ${formatMoney(loadedBooking.balanceDue)} now`
  if (startPayment.isPending || isOpeningPayment) {
    payButtonLabel = 'Opening secure payment…'
  }

  return (
    <BookingPageLayout title="Thank you">
      <div className="mx-auto max-w-2xl space-y-4">
        <BookingStatusCard statusText={statusText} bookingNumber={loadedBooking.bookingNumber}>
          {paymentResult === 'cancelled' && showPayButton && (
            <p className="mt-5 text-sm font-medium text-danger">Your payment was not completed.</p>
          )}
          {showPayButton && (
            <button
              type="button"
              onClick={handlePayNow}
              disabled={startPayment.isPending || isOpeningPayment}
              className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard className="size-4" strokeWidth={2} />
              {payButtonLabel}
            </button>
          )}
          {startPayment.isError && (
            <p className="mt-3 text-sm font-medium text-danger">{startPayment.error.message}</p>
          )}
        </BookingStatusCard>

        <div className="rounded-3xl bg-surface p-6 text-sm text-ink">
          <ConfirmationDetailsList booking={loadedBooking} />
        </div>

        <div className="rounded-3xl bg-surface p-6 text-ink">
          <PriceBreakdown lines={loadedBooking.priceLines} total={loadedBooking.total} />
        </div>

        <p className="text-center text-sm text-white/60">
          Keep this page's link to check your booking later. Questions? Call us on{' '}
          <a href={COMPANY.phoneLink} className="font-semibold text-white hover:text-accent-bright">
            {COMPANY.phoneDisplay}
          </a>
        </p>
      </div>
    </BookingPageLayout>
  )
}
