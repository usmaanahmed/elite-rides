import { useEffect, useRef, useState } from 'react'
import type { CarouselPosition, CarouselScroll } from '../types/fleet'
import { getPageScrollTarget } from '../utils/getPageScrollTarget'
import { readCarouselPosition } from '../utils/readCarouselPosition'

// Before the row has been measured: nothing to scroll yet
const START_POSITION: CarouselPosition = {
  hasOverflow: false,
  canScrollPrevious: false,
  canScrollNext: false,
  progress: 0,
  visibleShare: 1,
}

// Fleet carousel logic: keeps track of how far the row of cards is scrolled (for the arrow
// buttons and the progress bar) and moves the row one "page" of cards at a time.
// `cardCount` is only used to measure again when the number of cards changes.
export function useCarouselScroll(cardCount: number): CarouselScroll {
  const trackRef = useRef<HTMLUListElement>(null)
  const [position, setPosition] = useState<CarouselPosition>(START_POSITION)

  // Measure the row when it first appears and whenever its size changes
  // (window resized, phone rotated). ResizeObserver also runs once straight away.
  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return
    }
    const observer = new ResizeObserver(() => {
      setPosition(readCarouselPosition(track))
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [cardCount])

  // Runs while the visitor swipes / scrolls the row
  function handleScroll(): void {
    const track = trackRef.current
    if (track) {
      setPosition(readCarouselPosition(track))
    }
  }

  // direction: 1 = forwards (right), -1 = backwards (left)
  function scrollOnePage(direction: number): void {
    const track = trackRef.current
    if (!track) {
      return
    }

    // Jump instead of glide for visitors who asked for less motion
    let behavior: ScrollBehavior = 'smooth'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      behavior = 'auto'
    }

    track.scrollTo({ left: getPageScrollTarget(track, direction), behavior: behavior })
  }

  function showPreviousCards(): void {
    scrollOnePage(-1)
  }

  function showNextCards(): void {
    scrollOnePage(1)
  }

  return { trackRef, position, handleScroll, showPreviousCards, showNextCards }
}
