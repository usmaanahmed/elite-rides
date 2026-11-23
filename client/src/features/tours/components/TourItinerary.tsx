import type { PublicTour, TourStop } from '../types/tour'
import { getDurationText } from '../utils/tourDates'
import { TourJourneyMap } from './TourJourneyMap'
import { TourTimeline } from './TourTimeline'

type TourItineraryProps = {
  tour: PublicTour
  // All stops of the tour, numbered in order (see getTourStops)
  stops: TourStop[]
  // Only the stops that have a map position
  stopsOnMap: TourStop[]
}

// "3 days · 7 stops"
function getSummaryText(durationDays: number, stopCount: number): string {
  let stopsText = `${stopCount} stops`
  if (stopCount === 1) {
    stopsText = '1 stop'
  }
  return `${getDurationText(durationDays)} · ${stopsText}`
}

// "Your journey": the day by day timeline, then the map with every stop
export function TourItinerary({ tour, stops, stopsOnMap }: TourItineraryProps) {
  const dayTitles: string[] = []
  for (const day of tour.itinerary) {
    dayTitles.push(day.title)
  }

  return (
    <section aria-labelledby="tour-itinerary-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Itinerary</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h2 id="tour-itinerary-heading" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Your journey
        </h2>
        <p className="text-sm font-medium text-white/50">{getSummaryText(tour.durationDays, stops.length)}</p>
      </div>

      <div className="mt-6">
        <TourTimeline stops={stops} dayTitles={dayTitles} startDate={tour.startDate} />
      </div>

      {stopsOnMap.length > 0 && (
        <div className="mt-8">
          <h3 className="sr-only">Map of the journey</h3>
          <TourJourneyMap stops={stopsOnMap} tourTitle={tour.title} />
        </div>
      )}
    </section>
  )
}
