import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { ROUTES } from '../../../shared/constants/routes'
import { PriceCheckerForm } from '../../priceChecker/components/PriceCheckerForm'
import { QuoteResult } from '../../priceChecker/components/QuoteResult'
import { useQuote } from '../../priceChecker/hooks/useQuote'
import type { QuoteRequest } from '../../priceChecker/types/quote'
import { BookingCustomerModal } from '../components/BookingCustomerModal'
import { useAddBooking } from '../hooks/useBookings'
import type { BookingCustomerFormValues } from '../schemas/bookingCustomerFormSchema'

// Admin creates a booking: enter the journey, pick a vehicle by its price, then enter the passenger's details
export function NewBookingPage() {
  const navigate = useNavigate()
  const quoteMutation = useQuote()
  const addBookingMutation = useAddBooking()

  // The journey the quote was made for (needed again when the booking is created)
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null)
  // The vehicle the admin picked (null = the passenger details dialog is closed)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)

  const quote = quoteMutation.data
  const selectedVehicle = quote?.vehicles.find((vehicle) => vehicle.vehicleId === selectedVehicleId) ?? null

  function handleCheckPrice(request: QuoteRequest) {
    setQuoteRequest(request)
    setSelectedVehicleId(null)
    quoteMutation.mutate(request)
  }

  function closePassengerDialog() {
    addBookingMutation.reset()
    setSelectedVehicleId(null)
  }

  async function createBooking(values: BookingCustomerFormValues) {
    if (!quoteRequest || !selectedVehicleId) return

    try {
      const booking = await addBookingMutation.mutateAsync({
        quote: { ...quoteRequest, vehicleId: selectedVehicleId },
        vehicleId: selectedVehicleId,
        customer: { name: values.name, email: values.email, phone: values.phone, customerId: '' },
        luggage: Number(values.luggage),
        flightNo: values.flightNo,
        arrivalFrom: values.arrivalFrom,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      })
      navigate(ROUTES.bookings, { state: { successMessage: `Booking ${booking.bookingNumber} was created` } })
    } catch {
      // The error is shown inside the dialog
    }
  }

  let bookingErrorMessage = ''
  if (addBookingMutation.isError) {
    bookingErrorMessage = addBookingMutation.error.message
  }

  return (
    <>
      <PageHeader
        title="New Booking"
        description="Enter the journey, choose a vehicle, then add the passenger's details."
        actions={
          <Link
            to={ROUTES.bookings}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            Back to bookings
          </Link>
        }
      />

      <div className="mt-8 space-y-6">
        <PriceCheckerForm isLoading={quoteMutation.isPending} onSubmitQuote={handleCheckPrice} />

        {quoteMutation.isError && (
          <Alert variant="error" title="Could not get a price" description={quoteMutation.error.message} />
        )}

        {quote && <QuoteResult quote={quote} onSelectVehicle={setSelectedVehicleId} />}
      </div>

      <BookingCustomerModal
        isOpen={selectedVehicle !== null}
        onClose={closePassengerDialog}
        vehicleName={selectedVehicle?.vehicleName ?? ''}
        total={selectedVehicle?.total ?? 0}
        errorMessage={bookingErrorMessage}
        isSaving={addBookingMutation.isPending}
        onSave={createBooking}
      />
    </>
  )
}
