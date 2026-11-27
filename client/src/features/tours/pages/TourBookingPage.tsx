import { zodResolver } from '@hookform/resolvers/zod'
import { Luggage, Mail, MapPin, Phone, User, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { BookingPageLayout } from '../../booking/components/BookingPageLayout'
import { MissingJourneyNotice } from '../../booking/components/MissingJourneyNotice'
import { PaymentMethodField } from '../../booking/components/PaymentMethodField'
import { SectionCard } from '../../booking/components/SectionCard'
import { SelectField } from '../../booking/components/SelectField'
import { SubmitButton } from '../../booking/components/SubmitButton'
import { TextField } from '../../booking/components/TextField'
import { usePublicSettings } from '../../booking/hooks/usePublicData'
import { buildConfirmationLink } from '../../booking/utils/buildConfirmationLink'
import { buildNumberOptions } from '../../booking/utils/buildNumberOptions'
import { buildSuccessRedirectUrl } from '../../booking/utils/buildSuccessRedirectUrl'
import type { CreateBookingResult } from '../../booking/types/publicApi'
import { TourOrderSummary } from '../components/TourOrderSummary'
import { useCreateTourBooking, usePublicTour } from '../hooks/usePublicTours'
import { tourPassengerSchema, type TourPassengerValues } from '../schemas/tourPassengerSchema'
import { buildTourLink } from '../utils/buildTourLink'
import { clearTourDraft, loadTourDraft } from '../utils/tourDraftStorage'

// Step 2 of a tour booking: passenger details, pickup address and payment, then the booking is made
export function TourBookingPage() {
  const navigate = useNavigate()
  const draft = loadTourDraft()

  // The tour is loaded again here, so the price shown is always the current one
  let tourId = ''
  if (draft) {
    tourId = draft.tourId
  }
  const tourQuery = usePublicTour(tourId)
  const settingsQuery = usePublicSettings()
  const createTourBookingMutation = useCreateTourBooking()

  // True while the browser is on its way to Stripe's payment page
  const [isOpeningPayment, setIsOpeningPayment] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TourPassengerValues>({
    resolver: zodResolver(tourPassengerSchema),
    // No payment method yet: it is picked below once we know which ones the office has switched on
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      pickup: '',
      passengers: '1',
      luggage: '0',
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

  if (!draft) {
    return (
      <BookingPageLayout title="Your details">
        <MissingJourneyNotice message="Your booking has expired or wasn't started. Please choose your tour again." />
      </BookingPageLayout>
    )
  }

  if (tourQuery.isPending) {
    return (
      <BookingPageLayout title="Your details">
        <div className="h-64 animate-pulse rounded-3xl bg-surface/10" />
      </BookingPageLayout>
    )
  }

  const tour = tourQuery.data
  const vehicle = tour?.vehicles.find((item) => item.vehicleId === draft.vehicleId)

  if (!tour || !vehicle) {
    return (
      <BookingPageLayout title="Your details">
        <MissingJourneyNotice message="This tour or vehicle is no longer available. Please choose your tour again." />
      </BookingPageLayout>
    )
  }

  const settings = settingsQuery.data
  const maxPassengers = Math.min(vehicle.passengerCapacity, settings ? settings.maxPassengers : vehicle.passengerCapacity)
  const passengerOptions = buildNumberOptions(1, maxPassengers, 1, false, '')
  const luggageOptions = buildNumberOptions(0, vehicle.luggageCapacity, 1, false, '')

  // Messages that stop the customer from booking online
  let blockingMessage = ''
  if (settings && !settings.guestLogin) {
    blockingMessage = 'Online booking needs a customer account, which is coming soon. Please call us to book.'
  } else if (settings && !settings.cardPaymentAvailable && !settings.cashPaymentAvailable) {
    blockingMessage = 'Online booking is not available right now. Please call us to book.'
  }

  async function submitBooking(values: TourPassengerValues): Promise<void> {
    if (!draft || !settings || blockingMessage !== '') {
      return
    }

    let result: CreateBookingResult
    try {
      result = await createTourBookingMutation.mutateAsync({
        tourId: draft.tourId,
        vehicleId: draft.vehicleId,
        tourDate: draft.tourDate,
        pickupTime: draft.pickupTime,
        pickup: values.pickup,
        passengers: Number(values.passengers),
        luggage: Number(values.luggage),
        customer: { name: values.name, email: values.email, phone: values.phone, customerId: '' },
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      })
    } catch {
      // The error message is shown above the button
      return
    }

    clearTourDraft()
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
    <BookingPageLayout title="Your details" subtitle={tour.title}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <form onSubmit={handleSubmit(submitBooking)} noValidate className="order-2 space-y-4 lg:order-1">
          <SectionCard title="Passenger">
            <div className="space-y-3">
              <TextField
                id="tour-passenger-name"
                label="Full name"
                icon={User}
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  id="tour-passenger-email"
                  label="Email"
                  icon={Mail}
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <TextField
                  id="tour-passenger-phone"
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

          <SectionCard title="Pickup" description="Where should your Elite collect you?">
            <div className="space-y-3">
              <TextField
                id="tour-pickup-address"
                label="Pickup address"
                icon={MapPin}
                placeholder="Hotel, address or postcode"
                autoComplete="off"
                error={errors.pickup?.message}
                {...register('pickup')}
              />
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  id="tour-passengers"
                  label="Passengers"
                  icon={Users}
                  options={passengerOptions}
                  {...register('passengers')}
                />
                <SelectField
                  id="tour-luggage"
                  label="Large bags"
                  icon={Luggage}
                  options={luggageOptions}
                  {...register('luggage')}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Notes for the driver" description="Optional.">
            <textarea
              rows={3}
              aria-label="Notes for the driver"
              className="block w-full resize-y rounded-2xl border border-line bg-surface-muted px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/60 focus:border-accent/50 focus:bg-surface focus:ring-4 focus:ring-accent/10 sm:text-sm"
              placeholder="e.g. child seat needed, call on arrival"
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
                  We'll check your request and confirm the price before your tour is booked.
                </p>
              )}
            </SectionCard>
          )}

          {blockingMessage && (
            <p className="rounded-2xl bg-surface p-4 text-sm font-medium text-danger">{blockingMessage}</p>
          )}
          {createTourBookingMutation.isError && (
            <p className="rounded-2xl bg-surface p-4 text-sm font-medium text-danger">
              {createTourBookingMutation.error.message}
            </p>
          )}

          {blockingMessage === '' && (
            <SubmitButton label={submitLabel} disabled={!settings || isSubmitting || isOpeningPayment} />
          )}

          <p className="text-center text-sm text-white/60">
            Wrong vehicle or date?{' '}
            <Link to={buildTourLink(tour.id)} className="font-semibold text-white hover:text-accent-bright">
              Change it
            </Link>
          </p>
        </form>

        <div className="order-1 lg:sticky lg:top-6 lg:order-2">
          <TourOrderSummary tour={tour} vehicle={vehicle} draft={draft} />
        </div>
      </div>
    </BookingPageLayout>
  )
}
