// Placeholder cards in the same shape as the airport grid, shown while the airports load.
// Keeping the same size stops the page from jumping when the real cards appear.
// Shows 1 card on phones, 2 on tablets and 3 on wide screens (one full row of the grid).
export function AirportsSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      <AirportCardSkeleton className="" />
      <AirportCardSkeleton className="hidden sm:flex" />
      <AirportCardSkeleton className="hidden lg:flex" />
    </div>
  )
}

type AirportCardSkeletonProps = {
  // Extra classes, used to hide some cards on small screens
  className: string
}

// One placeholder card: number and label at the top, text lines at the bottom
function AirportCardSkeleton({ className }: AirportCardSkeletonProps) {
  return (
    <div
      className={`flex aspect-4/5 flex-col justify-between rounded-[28px] bg-night-raised p-5 ring-1 ring-white/10 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-6 animate-pulse rounded-full bg-white/10" />
        <div className="h-7 w-24 animate-pulse rounded-full bg-white/8" />
      </div>
      <div>
        <div className="h-7 w-44 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 h-3 w-3/4 animate-pulse rounded-full bg-white/6" />
        <div className="mt-2.5 h-3 w-1/2 animate-pulse rounded-full bg-white/6" />
        <div className="mt-6 h-10 animate-pulse rounded-xl bg-white/4" />
      </div>
    </div>
  )
}
