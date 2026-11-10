import { CalendarDays, Clock3, Luggage, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router'
import type { JourneyDetails } from '../types/journey'
import { formatDisplayDate } from '../utils/formatDisplayDate'

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

  return (
    <div className="rounded-3xl bg-surface p-5 text-ink sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">Your journey</p>
          <p className="mt-1 text-sm font-semibold">{tripLabel}</p>
        </div>
        <Link to="/#quote" className="text-sm font-semibold text-accent-ink hover:text-ink">
          Change
        </Link>
      </div>

      <ul className="mt-4 space-y-2.5 text-sm">
        <li className="flex gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
          <span>{journey.pickup}</span>
        </li>
        {journey.via.map((stop, index) => (
          <li key={index} className="flex gap-2.5 text-muted">
            <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
            <span>Stop: {stop}</span>
          </li>
        ))}
        {journey.dropoff && (
          <li className="flex gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={2} />
            <span>{journey.dropoff}</span>
          </li>
        )}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted" strokeWidth={2} />
          {formatDisplayDate(journey.pickupDate)}
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="size-4 text-muted" strokeWidth={2} />
          {journey.pickupTime}
        </p>
        <p className="flex items-center gap-2">
          <Users className="size-4 text-muted" strokeWidth={2} />
          {journey.passengers} {journey.passengers === 1 ? 'passenger' : 'passengers'}
        </p>
        <p className="flex items-center gap-2">
          <Luggage className="size-4 text-muted" strokeWidth={2} />
          {journey.luggage} {journey.luggage === 1 ? 'bag' : 'bags'}
        </p>
      </div>

      {journey.tripType === 'return' && (
        <p className="mt-3 text-sm text-muted">
          Return: {formatDisplayDate(journey.returnDate)} at {journey.returnTime}
        </p>
      )}
      {distanceMiles !== undefined && distanceMiles > 0 && (
        <p className="mt-3 text-sm text-muted">Distance: {distanceMiles} miles</p>
      )}
    </div>
  )
}
