import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ChartCard } from '../../../shared/components/charts/ChartCard'
import { ROUTES } from '../../../shared/constants/routes'
import { getInitials } from '../../../shared/utils/getInitials'
import { PAYMENT_METHOD_LABELS } from '../../bookings/constants/paymentMethods'
import type { Booking } from '../../bookings/types/booking'
import { formatFare, formatPickupDateTime } from '../../bookings/utils/formatBookingValues'

type RecentBookingsCardProps = {
  bookings: Booking[]
  className?: string
}

// "Heathrow Terminal 5, Wallis Rd, TW6 2GA, UK" → "Heathrow Terminal 5"
function getShortAddress(address: string): string {
  return address.split(',')[0]
}

export function RecentBookingsCard({ bookings, className = '' }: RecentBookingsCardProps) {
  return (
    <ChartCard
      title="Recent bookings"
      description="The latest pickups across all vehicles"
      className={className}
      action={
        <Link
          to={ROUTES.bookings}
          className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-accent-ink transition-colors hover:bg-accent-soft"
        >
          View all
          <ArrowUpRight className="size-3.5" strokeWidth={2} />
        </Link>
      }
    >
      <ul className="-my-3 divide-y divide-line">
        {bookings.map((booking) => {
          const { date, time } = formatPickupDateTime(booking.pickupAt)

          return (
            <li key={booking.id} className="flex items-center gap-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink">
                {getInitials(booking.passengerName)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{booking.passengerName}</p>
                  <span className="hidden shrink-0 text-[11px] tabular-nums text-muted sm:inline">{booking.orderNo}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {getShortAddress(booking.pickupAddress)} → {getShortAddress(booking.dropoffAddress)}
                </p>
              </div>

              {/* Vehicle and pickup time only fit on wider screens */}
              <div className="hidden w-32 shrink-0 md:block">
                <p className="truncate text-xs font-medium text-ink">{booking.vehicleName}</p>
                <p className="text-[11px] tabular-nums text-muted">
                  {date} · {time}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular-nums text-ink">{formatFare(booking.fare)}</p>
                <span className="mt-0.5 inline-block rounded-full bg-surface-muted px-2 py-px text-[10px] font-semibold text-muted ring-1 ring-line">
                  {PAYMENT_METHOD_LABELS[booking.paymentMethod]}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </ChartCard>
  )
}
