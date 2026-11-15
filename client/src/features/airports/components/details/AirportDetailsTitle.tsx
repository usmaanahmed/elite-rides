import { ArrowRight, MapPin, Navigation } from 'lucide-react'
import { Link } from 'react-router'
import type { PublicAirport } from '../../types/airport'
import { buildGoogleMapsLink } from '../../utils/buildMapLinks'

type AirportDetailsTitleProps = {
  airport: PublicAirport
}

// Title block of the airport page: label, big airport name, address,
// and two buttons ("Directions" in Google Maps and "Book a transfer").
// Wide screens: buttons on the right of the name. Phones: under it.
export function AirportDetailsTitle({ airport }: AirportDetailsTitleProps) {
  return (
    <div className="grid gap-8 motion-safe:animate-rise-in lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
      <div className="min-w-0">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
          <span className="h-px w-8 bg-accent" />
          Airport transfers
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
          {airport.name}
        </h1>
        <p className="mt-5 flex items-start gap-2 text-base text-white/60">
          <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-bright" strokeWidth={1.75} />
          {airport.address}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
        <a
          href={buildGoogleMapsLink(airport.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/10"
        >
          <Navigation aria-hidden="true" className="size-4 text-accent-bright" strokeWidth={2} />
          Directions
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </a>
        <Link
          to="/#quote"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(252,98,3,0.7)] transition hover:bg-accent-bright"
        >
          Book a transfer
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  )
}
