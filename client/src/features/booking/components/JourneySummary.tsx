import { CalendarDays, Clock3, Luggage, PenLine, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { JourneyDetails } from '../types/journey'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import { JourneyRouteList } from './JourneyRouteList'

type JourneySummaryProps = {
  journey: JourneyDetails
  // Miles from the quote (not shown for hourly hire or before the quote has loaded)
  distanceMiles?: number
}

// A white card with the journey the customer entered, and a link back to change it
export function JourneySummary({ journey, distanceMiles }: JourneySummaryProps) {
  let tripLabel = 'One way'
  if (journey.tripType === 'return') tripLabel = 'Return journey'
  if (journey.tripType === 'hourly') tripLabel = `By the hour · ${journey.hourlyDuration} hours`

  let showDistance = false
  if (distanceMiles !== undefined && distanceMiles > 0) {
    showDistance = true
  }

  return (
    <div className="rounded-3xl bg-surface p-5 text-ink shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] ring-1 ring-black/5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">Your journey</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-base font-semibold">
            {tripLabel}
            {showDistance && <span className="text-sm font-medium text-muted">· {distanceMiles} miles</span>}
          </p>
        </div>
        <Link
          to="/#quote"
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink transition hover:border-ink/30 hover:bg-surface-muted"
        >
          <PenLine className="size-3.5" strokeWidth={2} />
          Edit
        </Link>
      </div>

      <div className="mt-5">
        <JourneyRouteList journey={journey} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line">
        <SummaryDetail label="Date" icon={<CalendarDays className="size-3.5" strokeWidth={2} />}>
          {formatDisplayDate(journey.pickupDate)}
        </SummaryDetail>
        <SummaryDetail label="Time" icon={<Clock3 className="size-3.5" strokeWidth={2} />}>
          {journey.pickupTime}
        </SummaryDetail>
        <SummaryDetail label="Passengers" icon={<Users className="size-3.5" strokeWidth={2} />}>
          {journey.passengers}
        </SummaryDetail>
        <SummaryDetail label="Bags" icon={<Luggage className="size-3.5" strokeWidth={2} />}>
          {journey.luggage}
        </SummaryDetail>
      </div>

      {journey.tripType === 'return' && (
        <p className="mt-4 rounded-2xl bg-surface-muted px-4 py-3 text-sm">
          <span className="font-semibold">Return:</span> {formatDisplayDate(journey.returnDate)} at {journey.returnTime}
        </p>
      )}
    </div>
  )
}

type SummaryDetailProps = {
  label: string
  icon: ReactNode
  children: ReactNode
}

// One small box in the details grid, e.g. "Date / Sun, 15 Nov 2026"
function SummaryDetail({ label, icon, children }: SummaryDetailProps) {
  return (
    <div className="bg-surface-muted px-4 py-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{children}</p>
    </div>
  )
}
