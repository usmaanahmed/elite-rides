import { CircleCheck, CircleX, Clock3, LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import type { BookingStatusText } from '../utils/getBookingStatusText'

type BookingStatusCardProps = {
  statusText: BookingStatusText
  bookingNumber: string
  // Extra content under the booking number, e.g. the "Pay now" button
  children?: ReactNode
}

// The icon for each status
function StatusIcon({ icon }: { icon: BookingStatusText['icon'] }) {
  const iconClasses = 'mx-auto size-12 text-accent'
  if (icon === 'confirmed') {
    return <CircleCheck className={iconClasses} strokeWidth={1.75} />
  }
  if (icon === 'cancelled') {
    return <CircleX className={iconClasses} strokeWidth={1.75} />
  }
  if (icon === 'checking') {
    return <LoaderCircle className={`${iconClasses} motion-safe:animate-spin`} strokeWidth={1.75} />
  }
  return <Clock3 className={iconClasses} strokeWidth={1.75} />
}

// Top card of the thank-you page: status icon, heading, message and booking number
export function BookingStatusCard({ statusText, bookingNumber, children }: BookingStatusCardProps) {
  return (
    <div className="rounded-3xl bg-surface p-6 text-center text-ink sm:p-8" aria-live="polite">
      <StatusIcon icon={statusText.icon} />
      <h2 className="mt-3 text-xl font-semibold">{statusText.title}</h2>
      <p className="mt-2 text-sm text-muted">{statusText.message}</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Booking number</p>
      <p className="mt-1 text-2xl font-semibold tracking-wide tabular-nums">{bookingNumber}</p>
      {children}
    </div>
  )
}
