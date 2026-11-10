import { formatDateString } from './formatDateString'

// Today's date as "YYYY-MM-DD", e.g. for the `min` of a date input
export function getTodayDateString(): string {
  return formatDateString(new Date())
}
