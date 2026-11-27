import { FLEET_CARD_WIDTH } from '../../fleet/constants/fleetCarousel'

// Grey placeholder cards in the same shape as the stations carousel, shown while the stations load.
// Keeping the same size stops the page from jumping when the real cards appear.
export function StationsSkeleton() {
  return (
    <div aria-hidden="true" className="fleet-track flex gap-4 overflow-hidden sm:gap-5">
      <StationCardSkeleton />
      <StationCardSkeleton />
      <StationCardSkeleton />
      <StationCardSkeleton />
    </div>
  )
}

// One placeholder card: photo box, three text lines, round arrow
function StationCardSkeleton() {
  return (
    <div className={`shrink-0 overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/10 ${FLEET_CARD_WIDTH}`}>
      <div className="aspect-4/3 animate-pulse bg-white/6" />
      <div className="p-5 sm:p-6">
        <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/8" />
        <div className="mt-3 h-6 w-48 max-w-full animate-pulse rounded-full bg-white/10" />
        <div className="mt-3 h-3 w-3/4 animate-pulse rounded-full bg-white/6" />
        <div className="mt-6 ml-auto size-10 animate-pulse rounded-full bg-white/6" />
      </div>
    </div>
  )
}
