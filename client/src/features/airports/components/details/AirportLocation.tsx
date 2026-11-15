import { ArrowUpRight, MapPin } from 'lucide-react'
import type { PublicAirport } from '../../types/airport'
import { buildGoogleMapsLink, buildMapEmbedLink } from '../../utils/buildMapLinks'

type AirportLocationProps = {
  airport: PublicAirport
}

// "Location": a small Google map of the airport address, with the address and an
// "Open in Google Maps" link underneath. The map is turned dark with a CSS filter
// so it matches the website.
export function AirportLocation({ airport }: AirportLocationProps) {
  return (
    <section aria-labelledby="airport-location-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Location</p>
      <h2
        id="airport-location-heading"
        className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl"
      >
        Where we meet you
      </h2>

      <div className="mt-8 overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/10">
        <div className="relative aspect-16/10 sm:aspect-16/8">
          <iframe
            title={`Map of ${airport.name}`}
            src={buildMapEmbedLink(airport.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.55)_brightness(0.95)]"
          />
          {/* Soft fade into the address bar below */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-night-raised to-transparent"
          />
        </div>

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent">
              <MapPin aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Address</p>
              <p className="mt-1 font-medium text-white">{airport.address}</p>
            </div>
          </div>

          <a
            href={buildGoogleMapsLink(airport.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-bright transition-colors hover:text-white"
          >
            Open in Google Maps
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
