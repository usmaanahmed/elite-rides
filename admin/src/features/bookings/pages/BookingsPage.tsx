import { List, Plus } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { Modal } from '../../../shared/components/modals/Modal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { ROUTES } from '../../../shared/constants/routes'
import { BookingDetails } from '../components/BookingDetails'
import { BookingFiltersBar } from '../components/BookingFiltersBar'
import { BookingPaymentForm } from '../components/BookingPaymentForm'
import { BookingStatusActions } from '../components/BookingStatusActions'
import { BookingWaitingForm } from '../components/BookingWaitingForm'
import { BookingsTable } from '../components/BookingsTable'
import { useBookings } from '../hooks/useBookings'
import type { Booking, BookingFilters } from '../types/booking'

const noFilters: BookingFilters = { status: '', paymentStatus: '', dateFrom: '', dateTo: '' }

export function BookingsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [filters, setFilters] = useState<BookingFilters>(noFilters)
  // The bookings from the server (React Query keeps it cached and up to date)
  const bookingsQuery = useBookings(filters)

  // The id of the booking shown in the details dialog (null = no dialog).
  // We keep the id, not the booking, so the dialog shows fresh data after a change.
  const [bookingIdToView, setBookingIdToView] = useState<string | null>(null)

  // The "New booking" page sends a message here after a booking is created
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as { successMessage?: string } | null)?.successMessage ?? null,
  )

  let bookingToView: Booking | null = null
  if (bookingsQuery.data && bookingIdToView) {
    bookingToView = bookingsQuery.data.items.find((booking) => booking.id === bookingIdToView) ?? null
  }

  // Works out what the main part of the page should show
  function renderBookings() {
    if (bookingsQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (bookingsQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Bookings could not be loaded" description={bookingsQuery.error.message} />
          <Button variant="secondary" onClick={() => bookingsQuery.refetch()} isLoading={bookingsQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (bookingsQuery.data.items.length === 0) {
      return (
        <EmptyStateCard
          icon={List}
          title="No bookings found"
          description="Bookings made by customers, or added here, will appear in this list."
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <BookingsTable bookings={bookingsQuery.data.items} onView={(booking) => setBookingIdToView(booking.id)} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        description="View and manage every customer booking."
        actions={
          <Button icon={Plus} onClick={() => navigate(ROUTES.newBooking)}>
            New booking
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      <BookingFiltersBar filters={filters} onChange={setFilters} />

      {renderBookings()}

      <Modal
        isOpen={bookingToView !== null}
        onClose={() => setBookingIdToView(null)}
        title={`Booking ${bookingToView?.bookingNumber ?? ''}`}
      >
        {bookingToView && (
          <div className="space-y-6">
            <BookingDetails booking={bookingToView} />
            <BookingStatusActions booking={bookingToView} />
            {/* key makes the forms start fresh with the values of whichever booking is open */}
            <BookingWaitingForm key={`waiting-${bookingToView.id}-${bookingToView.waitingMinutes}`} booking={bookingToView} />
            <BookingPaymentForm
              key={`payment-${bookingToView.id}-${bookingToView.paymentStatus}-${bookingToView.amountPaid}`}
              booking={bookingToView}
            />
          </div>
        )}
      </Modal>
    </>
  )
}
