// Joins the form's separate date, hour and minute into one Date.
// e.g. ("2026-11-07", "14", "30") -> 7 Nov 2026, 14:30 in the visitor's time zone
export function buildDateTime(date: string, hour: string, minute: string): Date {
  return new Date(`${date}T${hour}:${minute}:00`)
}
