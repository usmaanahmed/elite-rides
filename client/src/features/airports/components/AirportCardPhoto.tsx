import { Plane } from 'lucide-react'
import { getFileUrl } from '../../../shared/api/apiUrl'
import type { PublicAirport } from '../types/airport'

type AirportCardPhotoProps = {
  airport: PublicAirport
}

// Background of an airport card: the airport's first photo, filling the whole card.
// It zooms in slowly when the card is hovered. If the office hasn't added a photo yet,
// a dark map-style panel with a plane is shown instead, so the card still looks finished.
// `-z-10` keeps it behind the card's text (the card uses `isolate`).
export function AirportCardPhoto({ airport }: AirportCardPhotoProps) {
  if (airport.imageUrls.length === 0) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night-raised">
        <div className="map-grid absolute inset-0" />
        <div className="absolute left-1/2 top-[38%] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[90px]" />
        <Plane
          className="absolute left-1/2 top-[38%] size-24 -translate-x-1/2 -translate-y-1/2 text-white/12 transition-transform duration-1000 ease-out group-hover:-translate-y-[60%] group-hover:text-white/20"
          strokeWidth={1}
        />
      </div>
    )
  }

  return (
    <img
      src={getFileUrl(airport.imageUrls[0])}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
    />
  )
}
