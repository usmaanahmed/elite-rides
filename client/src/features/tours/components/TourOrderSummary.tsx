import { CalendarDays, Clock3, PenLine } from 'lucide-react'
import { Link } from 'react-router'
import { PriceBreakdown } from '../../booking/components/PriceBreakdown'
import { formatDisplayDate } from '../../booking/utils/formatDisplayDate'
import { buildTourLink } from '../utils/buildTourLink'
import type { PublicTour, PublicTourVehicle, TourBookingDraft } from '../types/tour'

type TourOrderSummaryProps = {
  tour: PublicTour
  vehicle: PublicTourVehicle
  draft: TourBookingDraft
}

// The right-hand column of the tour booking page: the tour, vehicle, date, time and the fixed price
export function TourOrderSummary({ tour, vehicle, draft }: TourOrderSummaryProps) {
  const priceLines = [{ label: `${tour.title} (${vehicle.vehicleName})`, amount: vehicle.price }]

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-surface p-5 text-ink sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">Your price</p>
        <p className="mt-1 text-lg font-semibold">{vehicle.vehicleName}</p>
        <div className="mt-3">
          <PriceBreakdown lines={priceLines} total={vehicle.price} />
        </div>
      </div>

      <div className="rounded-3xl bg-surface p-5 text-ink shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] ring-1 ring-black/5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">Your tour</p>
            <p className="mt-1 text-base font-semibold">{tour.title}</p>
          </div>
          <Link
            to={buildTourLink(tour.id)}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink transition hover:border-ink/30 hover:bg-surface-muted"
          >
            <PenLine className="size-3.5" strokeWidth={2} />
            Edit
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line">
          <div className="bg-surface-muted px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              <CalendarDays className="size-3.5" strokeWidth={2} />
              Date
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums">{formatDisplayDate(draft.tourDate)}</p>
          </div>
          <div className="bg-surface-muted px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              <Clock3 className="size-3.5" strokeWidth={2} />
              Pickup time
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums">{draft.pickupTime}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
