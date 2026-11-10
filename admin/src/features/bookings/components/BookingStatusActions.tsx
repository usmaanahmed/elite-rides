import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { Alert } from '../../../shared/components/feedback/Alert'
import { useCancelBooking, useChangeBookingStatus } from '../hooks/useBookings'
import type { Booking } from '../types/booking'

type BookingStatusActionsProps = {
  booking: Booking
}

// Buttons that move a booking forward (approve / confirm / complete) or cancel it
export function BookingStatusActions({ booking }: BookingStatusActionsProps) {
  const statusMutation = useChangeBookingStatus()
  const cancelMutation = useCancelBooking()
  // true while the "Are you sure?" question for cancelling is showing
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false)

  // Finished bookings cannot change any more
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return null
  }

  // The one "forward" step that is possible from the current status
  let forwardLabel = 'Mark as completed'
  let forwardStatus: 'confirmed' | 'completed' = 'completed'
  if (booking.status === 'quote_requested') {
    forwardLabel = 'Approve quote'
    forwardStatus = 'confirmed'
  } else if (booking.status === 'pending') {
    forwardLabel = 'Confirm booking'
    forwardStatus = 'confirmed'
  }

  let errorMessage = ''
  if (statusMutation.isError) {
    errorMessage = statusMutation.error.message
  } else if (cancelMutation.isError) {
    errorMessage = cancelMutation.error.message
  }

  function moveForward() {
    statusMutation.mutate({ bookingId: booking.id, status: forwardStatus })
  }

  function cancel() {
    cancelMutation.mutate(booking.id)
  }

  return (
    <div className="space-y-3">
      {errorMessage && <Alert variant="error" title={errorMessage} />}

      {!isConfirmingCancel && (
        <div className="flex flex-wrap gap-2.5">
          <Button onClick={moveForward} isLoading={statusMutation.isPending}>
            {forwardLabel}
          </Button>
          <Button variant="secondary" onClick={() => setIsConfirmingCancel(true)}>
            Cancel booking
          </Button>
        </div>
      )}

      {isConfirmingCancel && (
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-sm text-ink">Cancel this booking?</p>
          <Button onClick={cancel} isLoading={cancelMutation.isPending}>
            Yes, cancel it
          </Button>
          <Button variant="secondary" onClick={() => setIsConfirmingCancel(false)}>
            Keep it
          </Button>
        </div>
      )}
    </div>
  )
}
