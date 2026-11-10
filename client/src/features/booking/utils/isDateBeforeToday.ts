import { getTodayDateString } from './getTodayDateString'

// True when a "YYYY-MM-DD" date is before today.
// Dates in this format sort the same way as text, so a simple `<` works.
export function isDateBeforeToday(date: string): boolean {
  return date < getTodayDateString()
}
