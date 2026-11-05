import { List, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { Modal } from '../../../shared/components/modals/Modal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { BookingDetails } from '../components/BookingDetails'
import { BookingsTable } from '../components/BookingsTable'
import { SAMPLE_BOOKINGS } from '../data/sampleBookings'
import type { Booking } from '../types/booking'

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS)
  // The booking shown in the details dialog (null = no dialog)
  const [bookingToView, setBookingToView] = useState<Booking | null>(null)
  // The booking waiting for the user to confirm its deletion (null = no dialog)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)
  // Text for the success message, e.g. "ELR001663 was deleted" (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // TODO: call the backend's delete endpoint once it exists
  function confirmDelete() {
    if (!bookingToDelete) return
    setBookings((current) => current.filter((booking) => booking.id !== bookingToDelete.id))
    setSuccessMessage(`${bookingToDelete.orderNo} was deleted`)
    setBookingToDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        description="View and manage every customer booking."
        actions={<Button icon={Plus}>New booking</Button>}
      />

      {successMessage && (
        <Alert
          variant="success"
          title={successMessage}
          onDismiss={() => setSuccessMessage(null)}
          className="mt-6"
        />
      )}

      {bookings.length > 0 ? (
        <div className="mt-8">
          <BookingsTable bookings={bookings} onView={setBookingToView} onDelete={setBookingToDelete} />
        </div>
      ) : (
        <EmptyStateCard
          icon={List}
          title="No bookings yet"
          description="Bookings made by customers will appear here."
          className="mt-8"
        />
      )}

      <Modal
        isOpen={bookingToView !== null}
        onClose={() => setBookingToView(null)}
        title={`Booking ${bookingToView?.orderNo ?? ''}`}
      >
        {bookingToView && <BookingDetails booking={bookingToView} />}
      </Modal>

      <Modal
        isOpen={bookingToDelete !== null}
        onClose={() => setBookingToDelete(null)}
        title="Delete booking?"
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setBookingToDelete(null)}>
              Cancel
            </Button>
            <Button icon={Trash2} onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted">
          Booking <span className="font-semibold text-ink">{bookingToDelete?.orderNo}</span> for{' '}
          {bookingToDelete?.passengerName} will be permanently removed.
        </p>
      </Modal>
    </>
  )
}
