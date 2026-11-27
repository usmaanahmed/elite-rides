import { PlaneTakeoff } from 'lucide-react'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import { usePublicAirports } from '../hooks/usePublicAirports'
import { AirportCard } from './AirportCard'
import { AirportPerks } from './AirportPerks'
import { AirportsHeader } from './AirportsHeader'
import { AirportsSkeleton } from './AirportsSkeleton'

// "Airports" section on the home page (the menu's "Airports" link jumps here with /#airports).
// The airports come from the server: the ones the office manages on the admin panel's
// "Airports" page. `isolate` keeps the background glows inside this section.
export function AirportsSection() {
  return (
    <section
      id="airports"
      aria-labelledby="airports-heading"
      className="relative isolate overflow-hidden border-t border-white/10 py-24 sm:py-28 lg:py-32"
    >
      {/* Soft glows behind the cards (decoration only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-56 top-1/4 size-[620px] rounded-full bg-dusk/10 blur-[150px]" />
        <div className="absolute -left-40 bottom-0 size-[520px] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <AirportsHeader />

        <div className="mt-14 lg:mt-16">
          <AirportsContent />
        </div>

        <div className="mt-5">
          <AirportPerks />
        </div>
      </div>
    </section>
  )
}

// Picks what to show under the heading: placeholder cards while loading, a message if something
// went wrong or there are no airports, otherwise the grid of airport cards
function AirportsContent() {
  const airportsQuery = usePublicAirports()

  function retryLoading(): void {
    airportsQuery.refetch()
  }

  if (airportsQuery.isPending) {
    return <AirportsSkeleton />
  }

  if (airportsQuery.isError) {
    return (
      <SectionNotice
        icon={PlaneTakeoff}
        title="We couldn't load our airports just now"
        message="Please try again in a moment, or give us a call and we'll arrange your airport transfer."
        onRetry={retryLoading}
      />
    )
  }

  if (airportsQuery.data.length === 0) {
    return (
      <SectionNotice
        icon={PlaneTakeoff}
        title="Airport transfers on request"
        message="Give us a call with your flight details and we'll arrange your pickup or drop-off."
      />
    )
  }

  return (
    <ul aria-label="Airports we cover" className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {airportsQuery.data.map((airport, index) => (
        <li key={airport.id}>
          <AirportCard airport={airport} position={index + 1} />
        </li>
      ))}
    </ul>
  )
}
