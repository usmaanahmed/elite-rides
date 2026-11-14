// Grey placeholder in the shape of a vehicle card, shown while prices load
export function VehicleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/10 sm:flex-row">
      <div className="h-44 animate-pulse bg-white/[0.06] sm:h-40 sm:w-56" />
      <div className="flex flex-1 flex-col justify-center gap-3 p-6">
        <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />
        <div className="h-3.5 w-56 max-w-full animate-pulse rounded-full bg-white/[0.07]" />
        <div className="mt-2 flex gap-2">
          <div className="h-7 w-24 animate-pulse rounded-full bg-white/[0.07]" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-white/[0.07]" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-white/[0.07]" />
        </div>
      </div>
    </div>
  )
}
