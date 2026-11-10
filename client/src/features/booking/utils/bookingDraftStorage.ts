import type { BookingDraft, JourneyDetails } from '../types/journey'

// The booking steps keep their data in the browser tab (sessionStorage),
// so a page refresh or the back button doesn't lose what the customer typed.
const STORAGE_KEY = 'elite-rides-booking-draft'

// Reads the saved draft. Gives null if there is none (or the browser blocks storage).
export function loadBookingDraft(): BookingDraft | null {
  try {
    const text = sessionStorage.getItem(STORAGE_KEY)
    if (!text) {
      return null
    }
    return JSON.parse(text) as BookingDraft
  } catch {
    return null
  }
}

function saveBookingDraft(draft: BookingDraft): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // Storage is blocked (e.g. private mode). The steps still work until the page is refreshed.
  }
}

// Step 1: a new journey starts a new draft (any vehicle chosen before is forgotten)
export function saveJourney(journey: JourneyDetails): void {
  saveBookingDraft({ journey: journey, vehicleId: '' })
}

// Step 2: remember the chosen vehicle
export function saveChosenVehicle(vehicleId: string): void {
  const draft = loadBookingDraft()
  if (!draft) {
    return
  }
  saveBookingDraft({ ...draft, vehicleId: vehicleId })
}

// After booking: start fresh next time
export function clearBookingDraft(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do
  }
}
