import { TrainFront } from 'lucide-react'
import { getFileUrl } from '../../../shared/api/apiUrl'
import type { PublicStation } from '../types/station'

type StationThumbnailProps = {
  station: PublicStation
}

// Photo on the left of a station row: the station's first photo, zooming in slowly on hover.
// If the office hasn't added a photo yet, a dark map-style box with a train is shown instead.
export function StationThumbnail({ station }: StationThumbnailProps) {
  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-night-raised ring-1 ring-white/10 sm:h-28 sm:w-40 lg:h-32 lg:w-48">
      {station.imageUrls.length > 0 ? (
        <img
          src={getFileUrl(station.imageUrls[0])}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <div className="map-grid absolute inset-0" />
          <TrainFront
            className="relative size-8 text-white/20 transition-colors duration-500 group-hover:text-accent-bright sm:size-10"
            strokeWidth={1.25}
          />
        </div>
      )}
    </div>
  )
}
