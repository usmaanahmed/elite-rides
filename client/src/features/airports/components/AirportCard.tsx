import { ArrowRight, MapPin, PlaneLanding } from 'lucide-react'
import { Link } from 'react-router'
import { formatTwoDigits } from '../../fleet/utils/formatTwoDigits'
import type { PublicAirport } from '../types/airport'
import { buildAirportLink } from '../utils/buildAirportLink'
import { AirportCardPhoto } from './AirportCardPhoto'

type AirportCardProps = {
  airport: PublicAirport
  // Place in the list, starting at 1 (shown as "01", "02"…)
  position: number
}

// One airport: a tall card with the airport photo behind it. A dark fade at the bottom keeps
// the white text readable on any photo. The whole card is one link to the airport's detail page
// (the "View airport" link stretches over the card with `after:absolute after:inset-0`).
// On hover the photo zooms in slowly, the card lifts a little and glows orange.
export function AirportCard({ airport, position }: AirportCardProps) {
  return (
    <article className="group relative isolate flex aspect-4/5 flex-col overflow-hidden rounded-[28px] bg-night-raised shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(252,98,3,0.45)] hover:ring-white/25 has-focus-visible:ring-2 has-focus-visible:ring-accent">
      <AirportCardPhoto airport={airport} />

      {/* Dark fade from the bottom (for the text) and a light one at the top (for the number) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/60 via-45% to-night/20"
      />
      {/* Warm orange glow from the bottom that fades in on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(252,98,3,0.28),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Top of the card: number and an "Airport" label */}
      <div className="flex items-center justify-between p-5 sm:p-6">
        <span className="text-xs font-semibold tracking-[0.2em] text-white/75 tabular-nums">
          {formatTwoDigits(position)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-night/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 ring-1 ring-white/15 backdrop-blur-md">
          <PlaneLanding aria-hidden="true" className="size-3.5 text-accent-bright" strokeWidth={2} />
          Airport
        </span>
      </div>

      {/* Bottom of the card (mt-auto pushes it down): name, address, description and the link */}
      <div className="mt-auto p-5 sm:p-6">
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[1.7rem]">
          {airport.name}
        </h3>

        <p className="mt-2 flex items-start gap-1.5 text-sm text-white/60">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-bright" strokeWidth={1.75} />
          <span className="line-clamp-1">{airport.address}</span>
        </p>

        {airport.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/70">{airport.description}</p>
        )}

        <Link
          to={buildAirportLink(airport.id)}
          className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-sm font-semibold text-white after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none"
        >
          <span>
            View airport
            <span className="sr-only">: {airport.name}</span>
          </span>
          <span className="grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md transition duration-500 group-hover:bg-accent group-hover:ring-accent">
            <ArrowRight
              aria-hidden="true"
              className="size-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
              strokeWidth={2}
            />
          </span>
        </Link>
      </div>
    </article>
  )
}
