import { useEffect, type RefObject } from 'react'
import {
  AUTO_SCROLL_END_PAUSE_MS,
  AUTO_SCROLL_RESUME_DELAY_MS,
  AUTO_SCROLL_SPEED,
} from '../constants/fleetCarousel'

// Moves of 2px or less are just rounding by the browser, not someone scrolling the row
const SCROLL_TOLERANCE = 2

// Longest gap between two frames we take into account (e.g. after switching browser tabs),
// so the row never jumps ahead
const MAX_FRAME_TIME_MS = 50

// Fleet carousel auto-scroll: slowly drifts the row of cards to the left, all by itself.
// It stops while the visitor is using the carousel and carries on a few seconds later:
// - mouse over the carousel (cards or arrows)
// - a finger on it, a swipe, or the arrow buttons (waits AUTO_SCROLL_RESUME_DELAY_MS afterwards)
// - keyboard focus on a card or button
// It only runs while the row is on screen, and never for visitors who asked for less motion.
// At the end of the row it rests a moment, then glides back to the first vehicle.
//
// trackRef = the scrolling <ul>, rootRef = the box around the row and its arrow buttons
export function useAutoScroll(
  trackRef: RefObject<HTMLUListElement | null>,
  rootRef: RefObject<HTMLDivElement | null>,
): void {
  useEffect(() => {
    const track = trackRef.current
    const root = rootRef.current
    if (!track || !root) {
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    // What is going on right now (plain variables, so moving the row never re-renders React)
    let isOnScreen = false
    let isMouseOver = false
    let isKeyboardFocused = false
    let isFingerDown = false
    // Time (ms) before which the row stays still, e.g. a few seconds after a swipe
    let pausedUntil = 0
    // Exact position of the drift. Kept separately because the browser may round scrollLeft.
    let autoPosition = track.scrollLeft
    // The scrollLeft we set last, to notice when something else moved the row
    let lastSetScrollLeft = track.scrollLeft
    // When the drift reached the end of the row (null = not at the end)
    let endReachedAt: number | null = null
    let lastFrameTime = performance.now()
    let frameId = 0

    function pauseForAWhile(): void {
      pausedUntil = performance.now() + AUTO_SCROLL_RESUME_DELAY_MS
    }

    function canMove(now: number): boolean {
      if (!isOnScreen || isMouseOver || isKeyboardFocused || isFingerDown) {
        return false
      }
      return now >= pausedUntil
    }

    // Runs on every screen refresh (about 60 times a second)
    function moveOneFrame(now: number): void {
      let frameTime = now - lastFrameTime
      if (frameTime > MAX_FRAME_TIME_MS) {
        frameTime = MAX_FRAME_TIME_MS
      }
      lastFrameTime = now

      if (track && canMove(now)) {
        driftRow(now, frameTime)
      } else {
        // Paused: the rest at the end of the row starts again from zero once it can move
        endReachedAt = null
      }

      frameId = requestAnimationFrame(moveOneFrame)
    }

    // Moves the row a tiny bit to the left, or handles the end of the row
    function driftRow(now: number, frameTime: number): void {
      if (!track) {
        return
      }

      // Something else moved the row (a swipe, the arrows, the glide back): carry on from there
      if (Math.abs(track.scrollLeft - lastSetScrollLeft) > SCROLL_TOLERANCE) {
        autoPosition = track.scrollLeft
      }

      const maxScroll = track.scrollWidth - track.clientWidth
      if (maxScroll <= 0) {
        // All cards fit on screen: nothing to move
        return
      }

      if (autoPosition < maxScroll - 1) {
        // Not at the end (any more)
        endReachedAt = null
        autoPosition = autoPosition + (AUTO_SCROLL_SPEED * frameTime) / 1000
        track.scrollLeft = autoPosition
        lastSetScrollLeft = track.scrollLeft
        return
      }

      // At the end of the row: rest for a moment, then glide back to the first vehicle
      if (endReachedAt === null) {
        endReachedAt = now
      } else if (now - endReachedAt >= AUTO_SCROLL_END_PAUSE_MS) {
        endReachedAt = null
        autoPosition = 0
        lastSetScrollLeft = 0
        track.scrollTo({ left: 0, behavior: 'smooth' })
      }
    }

    // A scroll we didn't make ourselves = someone is using the carousel
    function handleScroll(): void {
      if (track && Math.abs(track.scrollLeft - lastSetScrollLeft) > SCROLL_TOLERANCE) {
        pauseForAWhile()
      }
    }

    // Mouse (or pen) over the carousel. Touch is handled by the finger events below.
    function handlePointerEnter(event: PointerEvent): void {
      if (event.pointerType !== 'touch') {
        isMouseOver = true
      }
    }

    function handlePointerLeave(event: PointerEvent): void {
      if (event.pointerType !== 'touch') {
        isMouseOver = false
      }
    }

    function handlePointerDown(): void {
      isFingerDown = true
      pauseForAWhile()
    }

    function handlePointerUp(): void {
      isFingerDown = false
      pauseForAWhile()
    }

    // Only keyboard focus (Tab) counts. A mouse click also focuses a button, but the
    // mouse-over and pause rules already cover that.
    function handleFocusIn(event: FocusEvent): void {
      if (event.target instanceof Element && event.target.matches(':focus-visible')) {
        isKeyboardFocused = true
      }
    }

    function handleFocusOut(): void {
      isKeyboardFocused = false
    }

    // Only drift while the row is on screen
    const observer = new IntersectionObserver((entries) => {
      isOnScreen = entries[0].isIntersecting
    })
    observer.observe(track)

    track.addEventListener('scroll', handleScroll, { passive: true })
    root.addEventListener('pointerenter', handlePointerEnter)
    root.addEventListener('pointerleave', handlePointerLeave)
    root.addEventListener('pointerdown', handlePointerDown)
    root.addEventListener('pointerup', handlePointerUp)
    root.addEventListener('pointercancel', handlePointerUp)
    root.addEventListener('focusin', handleFocusIn)
    root.addEventListener('focusout', handleFocusOut)
    frameId = requestAnimationFrame(moveOneFrame)

    // Clean up everything when the carousel goes away
    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      track.removeEventListener('scroll', handleScroll)
      root.removeEventListener('pointerenter', handlePointerEnter)
      root.removeEventListener('pointerleave', handlePointerLeave)
      root.removeEventListener('pointerdown', handlePointerDown)
      root.removeEventListener('pointerup', handlePointerUp)
      root.removeEventListener('pointercancel', handlePointerUp)
      root.removeEventListener('focusin', handleFocusIn)
      root.removeEventListener('focusout', handleFocusOut)
    }
  }, [trackRef, rootRef])
}
