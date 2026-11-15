import { FLEET_CARD_WIDTH } from '../constants/fleetCarousel'

// Grey placeholder row in the same shape as the fleet carousel, shown while the vehicles load.
// Keeping the same size stops the page from jumping when the real cards appear.
export function FleetSkeleton() {
  return (
    <div aria-hidden="true" className="fleet-track flex gap-4 overflow-hidden sm:gap-5">
      <FleetCardSkeleton />
      <FleetCardSkeleton />
      <FleetCardSkeleton />
      <FleetCardSkeleton />
    </div>
  )
}

// One placeholder card, same layout as FleetCard: a soft vehicle-shaped blob on top,
// and the panel sliding up under it (same -mt / pt values as FleetCard)
function FleetCardSkeleton() {
  return (
    <div className={`flex shrink-0 flex-col ${FLEET_CARD_WIDTH}`}>
      <div className="relative z-10 flex aspect-4/3 items-end justify-center pb-[10%]">
        <div className="h-2/5 w-4/5 animate-pulse rounded-[40%] bg-white/8" />
      </div>
      <div className="mt-[-35%] rounded-[28px] bg-night-raised px-6 pb-5 pt-[calc(35%+1rem)] ring-1 ring-white/10">
        <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-white/6" />
        <div className="mt-2.5 h-3 w-2/3 animate-pulse rounded-full bg-white/6" />
        <div className="mt-7 h-10 animate-pulse rounded-xl bg-white/4" />
        <div className="mt-5 h-10 animate-pulse rounded-xl bg-white/4" />
      </div>
    </div>
  )
}
