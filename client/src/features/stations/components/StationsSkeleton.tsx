// Grey placeholder rows in the same shape as the station list, shown while the stations load.
// Keeping the same size stops the page from jumping when the real rows appear.
export function StationsSkeleton() {
  return (
    <div aria-hidden="true" className="divide-y divide-white/10 border-y border-white/10">
      <StationRowSkeleton />
      <StationRowSkeleton />
      <StationRowSkeleton />
      <StationRowSkeleton />
    </div>
  )
}

// One placeholder row: photo box, three text lines, round arrow
function StationRowSkeleton() {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 sm:gap-6 sm:py-6">
      <div className="size-20 animate-pulse rounded-2xl bg-white/6 sm:h-28 sm:w-40 lg:h-32 lg:w-48" />
      <div>
        <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/8" />
        <div className="mt-3 h-6 w-48 max-w-full animate-pulse rounded-full bg-white/10" />
        <div className="mt-3 h-3 w-3/4 animate-pulse rounded-full bg-white/6" />
      </div>
      <div className="size-10 animate-pulse rounded-full bg-white/6 sm:size-11" />
    </div>
  )
}
