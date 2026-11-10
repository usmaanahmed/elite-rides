import { BOOKING_STATUS_LABELS } from '../constants/paymentMethods'
import type { BookingStatus } from '../types/booking'

type BookingStatusBadgeProps = {
  status: BookingStatus
}

// A small coloured pill showing a booking's status
export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  let colourClasses = 'bg-surface-muted text-muted'
  if (status === 'confirmed' || status === 'completed') {
    colourClasses = 'bg-accent/10 text-accent'
  } else if (status === 'cancelled') {
    colourClasses = 'bg-danger-soft text-danger'
  }

  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${colourClasses}`}>
      {BOOKING_STATUS_LABELS[status]}
    </span>
  )
}
