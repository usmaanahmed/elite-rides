import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { CarouselPosition } from '../types/fleet'
import { formatTwoDigits } from '../utils/formatTwoDigits'

type FleetCarouselControlsProps = {
  vehicleCount: number
  position: CarouselPosition
  onPrevious: () => void
  onNext: () => void
}

// Same look for both round arrow buttons. Faded and not clickable at the start / end of the row.
const arrowButtonClasses =
  'grid size-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-white hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-30 sm:size-12'

// Row under the carousel: number of vehicles, a progress bar that follows the scrolling,
// and the previous / next buttons.
// mt-14 matches the carousel row's py-14, so the row's invisible padding never covers these buttons.
export function FleetCarouselControls({ vehicleCount, position, onPrevious, onNext }: FleetCarouselControlsProps) {
  // The orange part of the bar is as wide as the share of the row on screen,
  // and slides from the left end (start of the row) to the right end (end of the row)
  const barWidth = position.visibleShare * 100
  const barLeft = position.progress * (100 - barWidth)

  return (
    <div className="mx-auto mt-14 flex max-w-7xl items-center gap-5 px-4 sm:gap-8 sm:px-6 lg:px-8">
      <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/40 tabular-nums">
        <span className="text-white">{formatTwoDigits(vehicleCount)}</span> vehicles
      </p>

      <div aria-hidden="true" className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 rounded-full bg-accent"
          style={{ width: barWidth + '%', left: barLeft + '%' }}
        />
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!position.canScrollPrevious}
          aria-label="Previous vehicles"
          aria-controls="fleet-track"
          className={arrowButtonClasses}
        >
          <ArrowLeft className="size-4.5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!position.canScrollNext}
          aria-label="Next vehicles"
          aria-controls="fleet-track"
          className={arrowButtonClasses}
        >
          <ArrowRight className="size-4.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
