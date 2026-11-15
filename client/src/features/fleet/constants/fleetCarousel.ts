// Width of one card in the fleet carousel (used by the real cards and the loading placeholders).
// Phones: most of the screen, so the edge of the next card peeks in.
// Bigger screens: a fixed width, so about 2 cards show on tablets and 3 or more on desktops.
export const FLEET_CARD_WIDTH = 'w-[85%] sm:w-[22rem] lg:w-[24rem] xl:w-[25rem]'

// Auto-scroll: how fast the row slowly drifts to the left on its own, in pixels per second.
// Lower number = slower. (35 = about 12 seconds per card on a desktop.)
export const AUTO_SCROLL_SPEED = 35

// After someone uses the carousel (swipe, arrows, touch), wait this long before drifting again
export const AUTO_SCROLL_RESUME_DELAY_MS = 3000

// At the end of the row, rest this long before gliding back to the first vehicle
export const AUTO_SCROLL_END_PAUSE_MS = 2000
