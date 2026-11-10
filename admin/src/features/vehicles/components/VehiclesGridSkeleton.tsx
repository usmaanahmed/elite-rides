// How many grey placeholder cards to show while loading
const PLACEHOLDER_CARDS = [1, 2, 3]

// Grey, pulsing cards in the same shape as the vehicle cards, shown while the list loads
export function VehiclesGridSkeleton() {
  return (
    <div role="status" className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      <span className="sr-only">Loading vehicles…</span>

      {PLACEHOLDER_CARDS.map((cardNumber) => (
        <div key={cardNumber} aria-hidden="true" className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="aspect-video animate-pulse border-b border-line bg-surface-muted" />
          <div className="p-4 sm:p-5">
            <div className="h-4 w-2/5 animate-pulse rounded-md bg-line/70" />
            <div className="mt-3 h-3 w-4/5 animate-pulse rounded-md bg-line/50" />
            <div className="mt-2 h-3 w-3/5 animate-pulse rounded-md bg-line/50" />
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="h-18.5 animate-pulse rounded-xl bg-surface-muted" />
              <div className="h-18.5 animate-pulse rounded-xl bg-surface-muted" />
              <div className="h-18.5 animate-pulse rounded-xl bg-surface-muted" />
            </div>
            <div className="mt-4 flex gap-1.5 border-t border-line pt-4">
              <div className="h-6 w-28 animate-pulse rounded-full bg-line/50" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-line/50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
