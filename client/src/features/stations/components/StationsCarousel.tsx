import { FLEET_CARD_WIDTH } from '../../fleet/constants/fleetCarousel'
import { FleetCarouselControls } from '../../fleet/components/FleetCarouselControls'
import { useCarouselScroll } from '../../fleet/hooks/useCarouselScroll'
import type { PublicStation } from '../types/station'
import { StationCard } from './StationCard'

type StationsCarouselProps = {
  stations: PublicStation[]
}

// Sideways-scrolling row of station cards. Same behaviour as the fleet carousel (swipe or
// use the arrow buttons), but without the automatic drifting. The arrows and progress bar
// only show when the cards don't all fit on screen.
// `.fleet-track` (index.css) = full screen width, first card lined up with the page content.
export function StationsCarousel({ stations }: StationsCarouselProps) {
  const { trackRef, position, handleScroll, showPreviousCards, showNextCards } = useCarouselScroll(stations.length)

  return (
    <div>
      <ul
        id="stations-track"
        ref={trackRef}
        onScroll={handleScroll}
        aria-label="Stations we cover"
        className="fleet-track relative flex items-stretch gap-4 overflow-x-auto scrollbar-none sm:gap-5"
      >
        {stations.map((station, index) => (
          <li key={station.id} className={`shrink-0 ${FLEET_CARD_WIDTH}`}>
            <StationCard station={station} position={index + 1} />
          </li>
        ))}
      </ul>

      {position.hasOverflow && (
        <FleetCarouselControls
          itemCount={stations.length}
          itemName="stations"
          trackId="stations-track"
          position={position}
          onPrevious={showPreviousCards}
          onNext={showNextCards}
        />
      )}
    </div>
  )
}
