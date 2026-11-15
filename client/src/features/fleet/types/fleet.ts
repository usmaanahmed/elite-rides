import type { RefObject } from 'react'

// Where the fleet carousel is scrolled to, read from the row of cards
export type CarouselPosition = {
  // true = the cards don't all fit on screen, so the arrows and progress bar are shown
  hasOverflow: boolean
  canScrollPrevious: boolean
  canScrollNext: boolean
  // 0 = scrolled to the start, 1 = scrolled to the end
  progress: number
  // How much of the row is on screen, e.g. 0.5 = half of the cards are visible
  visibleShare: number
}

// What useCarouselScroll gives back to the carousel
export type CarouselScroll = {
  // Attach to the <ul> that holds the cards
  trackRef: RefObject<HTMLUListElement | null>
  position: CarouselPosition
  // Call from the row's onScroll
  handleScroll: () => void
  showPreviousCards: () => void
  showNextCards: () => void
}
