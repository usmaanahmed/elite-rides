import type { CarouselPosition } from '../types/fleet'

// A few pixels of leeway: some browsers stop scrolling half a pixel before the real end
const EDGE_ALLOWANCE = 4

// Reads how far the row of cards is scrolled: can it move left / right, and how far along it is
export function readCarouselPosition(track: HTMLElement): CarouselPosition {
  const maxScroll = track.scrollWidth - track.clientWidth
  const hasOverflow = maxScroll > EDGE_ALLOWANCE

  // 0 at the start, 1 at the end. Kept between 0 and 1 (iPhones can "bounce" past the ends).
  let progress = 0
  if (hasOverflow) {
    progress = track.scrollLeft / maxScroll
  }
  if (progress < 0) {
    progress = 0
  }
  if (progress > 1) {
    progress = 1
  }

  return {
    hasOverflow: hasOverflow,
    canScrollPrevious: track.scrollLeft > EDGE_ALLOWANCE,
    canScrollNext: track.scrollLeft < maxScroll - EDGE_ALLOWANCE,
    progress: progress,
    visibleShare: track.clientWidth / track.scrollWidth,
  }
}
