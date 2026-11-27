import { useRef } from 'react'
import type { PublicVehicle } from '../../booking/types/publicApi'
import { FLEET_CARD_WIDTH } from '../constants/fleetCarousel'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { useCarouselScroll } from '../hooks/useCarouselScroll'
import { FleetCard } from './FleetCard'
import { FleetCarouselControls } from './FleetCarouselControls'

type FleetCarouselProps = {
  // Already sorted by the office (display order on the "Vehicles & Mileage Setting" page)
  vehicles: PublicVehicle[]
}

// Sideways-scrolling row of vehicle cards. It slowly drifts to the left by itself (see
// useAutoScroll) and stops while the visitor uses it. Visitors can also swipe it (phones,
// trackpads) or use the arrow buttons. The arrows and progress bar only show when the cards
// don't all fit on screen.
export function FleetCarousel({ vehicles }: FleetCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { trackRef, position, handleScroll, showPreviousCards, showNextCards } = useCarouselScroll(vehicles.length)
  useAutoScroll(trackRef, rootRef)

  return (
    <div ref={rootRef}>
      {/*
        .fleet-track (index.css) = full screen width, first card lined up with the page content.
        `relative` lets the arrow buttons measure the cards (see getPageScrollTarget).
        `py-14 -my-14` adds room for the card shadow, the vehicle rising on hover and the glow,
        without adding space on the page.
        (No CSS scroll-snap here on purpose: it would stop the slow auto-scroll from moving.
        The arrow buttons line the cards up themselves.)
      */}
      <ul
        id="fleet-track"
        ref={trackRef}
        onScroll={handleScroll}
        aria-label="Our vehicles"
        className="fleet-track relative -my-14 flex gap-4 overflow-x-auto py-14 scrollbar-none sm:gap-5"
      >
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className={`shrink-0 ${FLEET_CARD_WIDTH}`}>
            <FleetCard vehicle={vehicle} />
          </li>
        ))}
      </ul>

      {position.hasOverflow && (
        <FleetCarouselControls
          itemCount={vehicles.length}
          itemName="vehicles"
          trackId="fleet-track"
          position={position}
          onPrevious={showPreviousCards}
          onNext={showNextCards}
        />
      )}
    </div>
  )
}
