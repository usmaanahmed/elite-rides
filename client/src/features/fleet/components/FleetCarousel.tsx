import type { PublicVehicle } from '../../booking/types/publicApi'
import { FLEET_CARD_WIDTH } from '../constants/fleetCarousel'
import { useCarouselScroll } from '../hooks/useCarouselScroll'
import { FleetCard } from './FleetCard'
import { FleetCarouselControls } from './FleetCarouselControls'

type FleetCarouselProps = {
  // Already sorted by the office (display order on the "Vehicles & Mileage Setting" page)
  vehicles: PublicVehicle[]
}

// Sideways-scrolling row of vehicle cards. Visitors can swipe it (phones, trackpads) or use the
// arrow buttons; cards snap into line. The arrows and progress bar only show when the cards
// don't all fit on screen.
export function FleetCarousel({ vehicles }: FleetCarouselProps) {
  const { trackRef, position, handleScroll, showPreviousCards, showNextCards } = useCarouselScroll(vehicles.length)

  return (
    <div>
      {/*
        .fleet-track (index.css) = full screen width, first card lined up with the page content.
        `relative` lets the arrow buttons measure the cards (see getPageScrollDistance).
        `py-14 -my-14` adds room for the card shadow, the vehicle rising on hover and the glow,
        without adding space on the page.
      */}
      <ul
        id="fleet-track"
        ref={trackRef}
        onScroll={handleScroll}
        aria-label="Our vehicles"
        className="fleet-track relative -my-14 flex snap-x snap-mandatory gap-4 overflow-x-auto py-14 scrollbar-none sm:gap-5"
      >
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className={`shrink-0 snap-start ${FLEET_CARD_WIDTH}`}>
            <FleetCard vehicle={vehicle} />
          </li>
        ))}
      </ul>

      {position.hasOverflow && (
        <FleetCarouselControls
          vehicleCount={vehicles.length}
          position={position}
          onPrevious={showPreviousCards}
          onNext={showNextCards}
        />
      )}
    </div>
  )
}
