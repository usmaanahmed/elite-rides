import type { TourBookingDraft } from '../types/tour'

// The tour booking steps keep their data in the browser tab (sessionStorage),
// so a page refresh or the back button doesn't lose what the customer chose.
const STORAGE_KEY = 'elite-rides-tour-draft'

// Reads the saved draft. Gives null if there is none (or the browser blocks storage).
export function loadTourDraft(): TourBookingDraft | null {
  try {
    const text = sessionStorage.getItem(STORAGE_KEY)
    if (!text) {
      return null
    }
    return JSON.parse(text) as TourBookingDraft
  } catch {
    return null
  }
}

// Remembers the vehicle, date and time chosen on the tour page
export function saveTourDraft(draft: TourBookingDraft): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // Storage is blocked (e.g. private mode). The steps still work until the page is refreshed.
  }
}

// After booking: start fresh next time
export function clearTourDraft(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do
  }
}
