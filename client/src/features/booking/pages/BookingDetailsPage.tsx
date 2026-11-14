import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin, Phone, Plane, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ROUTES } from '../../../shared/constants/routes'
import { BookingPageLayout } from '../components/BookingPageLayout'
import { CouponSection } from '../components/CouponSection'
import { ExtrasSection } from '../components/ExtrasSection'
import { MissingJourneyNotice } from '../components/MissingJourneyNotice'
import { OrderSummary } from '../components/OrderSummary'
import { PaymentMethodField } from '../components/PaymentMethodField'
import { SectionCard } from '../components/SectionCard'
import { SubmitButton } from '../components/SubmitButton'
import { TextField } from '../components/TextField'
import { useCouponCheck, useCreateBooking, useJourneyQuote, usePublicSettings } from '../hooks/usePublicData'
import { passengerDetailsSchema, type PassengerDetailsValues } from '../schemas/passengerDetailsSchema'
import type { BookingExtras } from '../types/journey'
import type { CreateBookingResult, QuoteRequest } from '../types/publicApi'
import { clearBookingDraft, loadBookingDraft } from '../utils/bookingDraftStorage'
import { buildConfirmationLink } from '../utils/buildConfirmationLink'
import { buildQuoteRequest, NO_EXTRAS } from '../utils/buildQuoteRequest'
import { buildSuccessRedirectUrl } from '../utils/buildSuccessRedirectUrl'

// Step 3: extras, passenger details, coupon and payment, then the booking is made
export function BookingDetailsPage() {
  const navigate = useNavigate()
  const draft = loadBookingDraft()
  const settingsQuery = usePublicSettings()
  const couponCheck = useCouponCheck()
  const createBookingMutation = useCreateBooking()

  const [extras, setExtras] = useState<BookingExtras>(NO_EXTRAS)
  // The coupon that passed the check ("" = none)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  // True while the browser is on its way to Stripe's payment page
  const [isOpeningPayment, setIsOpeningPayment] = useState(false)

  // The live price of the chosen vehicle with the extras and coupon. It updates whenever they change.
  let quoteRequest: QuoteRequest | null = null
  if (draft && draft.vehicleId !== '') {
    quoteRequest = buildQuoteRequest(draft.journey, extras, couponCode, draft.vehicleId)
  }
  const quoteQuery = useJourneyQuote(quoteRequest)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PassengerDetailsValues>({
    resolver: zodResolver(passengerDetailsSchema),
    // No payment method yet: it is picked below once we know which ones the office has switched on
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      flightNo: '',
      arrivalFrom: '',
      notes: '',
    },
    mode: 'onTouched',
  })
  const paymentMethod = useWatch({ control, name: 'paymentMethod' })

  // Once the settings arrive, pre-select the first payment method that is switched on (card first)
  const settingsData = settingsQuery.data
  useEffect(() => {
    if (!settingsData || getValues('paymentMethod')) {
      return
    }
    if (settingsData.cardPaymentAvailable) {
      setValue('paymentMethod', 'pay_card')
    } else if (settingsData.cashPaymentAvailable) {
      setValue('paymentMethod', 'pay_cash')
    }
  }, [settingsData, getValues, setValue])

  if (!draft || draft.vehicleId === '') {
    return (
      <BookingPageLayout title="Your details" currentStep={3}>
        <MissingJourneyNotice message="Your booking has expired or wasn't started. Please enter your journey again." />
      </BookingPageLayout>
    )
  }

  const journey = draft.journey
  const vehicleId = draft.vehicleId
  const settings = settingsQuery.data
  const vehicleQuote = quoteQuery.data?.vehicles[0]

  let quoteErrorMessage = ''
  if (quoteQuery.isError) {
    quoteErrorMessage = quoteQuery.error.message
  }

  // Booking is only possible once the price is known and the vehicle can do this journey
  const canBook = Boolean(settings && vehicleQuote && vehicleQuote.available && !quoteQuery.isFetching)

  function applyCoupon(code: string): void {
    setCouponError('')
    // Ask for a price with the coupon first: the server says if the code is not valid
    couponCheck.mutate(buildQuoteRequest(journey, extras, code, vehicleId), {
      onSuccess: () => setCouponCode(code),
      onError: (error) => setCouponError(error.message),
    })
  }

  function removeCoupon(): void {
    setCouponCode('')
    setCouponError('')
  }

  async function submitBooking(values: PassengerDetailsValues): Promise<void> {
    if (!quoteRequest || !settings || !canBook || blockingMessage !== '') {
      return
    }

    let result: CreateBookingResult
    try {
      result = await createBookingMutation.mutateAsync({
        quote: quoteRequest,
        vehicleId: vehicleId,
        customer: { name: values.name, email: values.email, phone: values.phone, customerId: '' },
        luggage: journey.luggage,
        flightNo: values.flightNo,
        arrivalFrom: values.arrivalFrom,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      })
    } catch {
      // The error message is shown above the button
      return
    }

    clearBookingDraft()
    const booking = result.booking

    // Card payment: go to Stripe's secure payment page. Stripe sends the customer back to our thank-you page.
    if (result.checkoutUrl !== '') {
      setIsOpeningPayment(true)
      window.location.assign(result.checkoutUrl)
      return
    }

    // The office can send customers to their own "thank you" page instead of ours
    // (not while a card payment is still owed: our page has the "Pay now" button)
    if (settings.bookingSuccessRedirectUrl !== '' && !booking.canPayByCard) {
      const redirectUrl = buildSuccessRedirectUrl(settings.bookingSuccessRedirectUrl, booking)
      if (redirectUrl) {
        window.location.assign(redirectUrl)
        return
      }
    }
    navigate(buildConfirmationLink(booking.reference), { replace: true })
  }

  // Messages that stop the customer from booking online
  let blockingMessage = ''
  if (settings && !settings.guestLogin) {
    blockingMessage = 'Online booking needs a customer account, which is coming soon. Please call us to book.'
  } else if (settings && !settings.cardPaymentAvailable && !settings.cashPaymentAvailable) {
    blockingMessage = 'Online booking is not available right now. Please call us to book.'
  }

  let submitLabel = 'Confirm booking'
  if (settings && settings.isQuotation) {
    submitLabel = 'Request quote'
  } else if (paymentMethod === 'pay_card') {
    submitLabel = 'Continue to payment'
  }
  if (isSubmitting) {
    submitLabel = 'Booking…'
  }
  if (isOpeningPayment) {
    submitLabel = 'Opening secure payment…'
  }

  return (
    <BookingPageLayout title="Your details" currentStep={3}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <form onSubmit={handleSubmit(submitBooking)} noValidate className="order-2 space-y-4 lg:order-1">
          <SectionCard title="Passenger">
            <div className="space-y-3">
              <TextField
                id="passenger-name"
                label="Full name"
                icon={User}
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  id="passenger-email"
                  label="Email"
                  icon={Mail}
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <TextField
                  id="passenger-phone"
                  label="Phone"
                  icon={Phone}
                  type="tel"
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Flight details" description="Optional. For airport pickups, so the driver can track your flight.">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                id="flight-no"
                label="Flight number"
                icon={Plane}
                placeholder="e.g. BA117"
                autoComplete="off"
                error={errors.flightNo?.message}
                {...register('flightNo')}
              />
              <TextField
                id="arrival-from"
                label="Arriving from"
                icon={MapPin}
                placeholder="e.g. New York"
                autoComplete="off"
                error={errors.arrivalFrom?.message}
                {...register('arrivalFrom')}
              />
            </div>
          </SectionCard>

          {settings && (
            <SectionCard title="Extras" description="The price on the right updates as you add extras.">
              <ExtrasSection extras={extras} prices={settings.extraPrices} onChange={setExtras} />
            </SectionCard>
          )}

          <SectionCard title="Coupon">
            <CouponSection
              appliedCode={couponCode}
              isChecking={couponCheck.isPending}
              errorMessage={couponError}
              onApply={applyCoupon}
              onRemove={removeCoupon}
            />
          </SectionCard>

          <SectionCard title="Notes for the driver" description="Optional.">
            <textarea
              rows={3}
              aria-label="Notes for the driver"
              className="block w-full resize-y rounded-2xl border border-line bg-surface-muted px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/60 focus:border-accent/50 focus:bg-surface focus:ring-4 focus:ring-accent/10 sm:text-sm"
              placeholder="e.g. child seat facing forward, call on arrival"
              {...register('notes')}
            />
            {errors.notes?.message && <p className="mt-2 text-sm font-medium text-danger">{errors.notes.message}</p>}
          </SectionCard>

          {settings && (
            <SectionCard title="Payment">
              <PaymentMethodField
                field={register('paymentMethod')}
                showCard={settings.cardPaymentAvailable}
                showCash={settings.cashPaymentAvailable}
                error={errors.paymentMethod?.message}
              />
              {settings.isQuotation && (
                <p className="mt-3 text-sm text-muted">
                  We'll check your request and confirm the price before your journey is booked.
                </p>
              )}
            </SectionCard>
          )}

          {blockingMessage && (
            <p className="rounded-2xl bg-surface p-4 text-sm font-medium text-danger">{blockingMessage}</p>
          )}
          {createBookingMutation.isError && (
            <p className="rounded-2xl bg-surface p-4 text-sm font-medium text-danger">
              {createBookingMutation.error.message}
            </p>
          )}

          {blockingMessage === '' && (
            <SubmitButton label={submitLabel} disabled={!canBook || isSubmitting || isOpeningPayment} />
          )}

          <p className="text-center text-sm text-white/60">
            Wrong vehicle?{' '}
            <Link to={ROUTES.chooseVehicle} className="font-semibold text-white hover:text-accent-bright">
              Choose another
            </Link>
          </p>
        </form>

        <div className="order-1 lg:sticky lg:top-6 lg:order-2">
          <OrderSummary
            journey={journey}
            distanceMiles={quoteQuery.data?.distanceMiles}
            vehicleQuote={vehicleQuote}
            isUpdating={quoteQuery.isFetching}
            errorMessage={quoteErrorMessage}
          />
        </div>
      </div>
    </BookingPageLayout>
  )
}
