import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { usePublicAirports } from '../../hooks/usePublicAirports'
import type { PublicAirport } from '../../types/airport'
import { AirportCard } from '../AirportCard'

// At most this many other airports are shown at the bottom of the page
const MAX_OTHER_AIRPORTS = 3

type OtherAirportsProps = {
  // The airport this page is about (left out of the list)
  currentAirportId: string
}

type OtherAirport = {
  airport: PublicAirport
  // Place in the full list (same number as on the home page)
  position: number
}

// "Other airports we cover" at the bottom of the airport page, using the same cards as the home page.
// Shows nothing while loading, on an error, or when there are no other airports.
export function OtherAirports({ currentAirportId }: OtherAirportsProps) {
  const airportsQuery = usePublicAirports()

  if (!airportsQuery.data) {
    return null
  }

  const otherAirports: OtherAirport[] = []
  for (let index = 0; index < airportsQuery.data.length; index++) {
    const airport = airportsQuery.data[index]
    if (airport.id !== currentAirportId && otherAirports.length < MAX_OTHER_AIRPORTS) {
      otherAirports.push({ airport: airport, position: index + 1 })
    }
  }

  if (otherAirports.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="other-airports-heading" className="mt-24 border-t border-white/10 pt-16 lg:mt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="other-airports-heading"
          className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl"
        >
          Other airports we cover
        </h2>
        <Link
          to="/#airports"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
        >
          All airports
          <ArrowRight
            aria-hidden="true"
            className="size-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {otherAirports.map((item) => (
          <li key={item.airport.id}>
            <AirportCard airport={item.airport} position={item.position} />
          </li>
        ))}
      </ul>
    </section>
  )
}
