import { CalendarDays, Clock, MapPin, type LucideIcon } from 'lucide-react'
import type { PublicTour, TourStop } from '../types/tour'
import { getDurationText, getTourDateRangeText } from '../utils/tourDates'

type TourFactsProps = {
  tour: PublicTour
  stops: TourStop[]
}

type FactProps = {
  icon: LucideIcon
  label: string
  value: string
}

// One fact: a small icon, a label and the value, e.g. "Duration · 3 days"
function Fact({ icon: Icon, label, value }: FactProps) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent">
        <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </li>
  )
}

// Quick facts under the tour title: duration, dates (if set) and number of stops (if there is an itinerary)
export function TourFacts({ tour, stops }: TourFactsProps) {
  const dateText = getTourDateRangeText(tour.startDate, tour.endDate)

  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-4">
      <Fact icon={Clock} label="Duration" value={getDurationText(tour.durationDays)} />
      {dateText !== '' && <Fact icon={CalendarDays} label="Dates" value={dateText} />}
      {stops.length > 0 && (
        <Fact icon={MapPin} label="Route" value={`${stops[0].place.name} → ${stops[stops.length - 1].place.name}`} />
      )}
    </ul>
  )
}
