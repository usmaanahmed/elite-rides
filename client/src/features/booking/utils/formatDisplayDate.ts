// "2026-12-25" -> "Fri 25 Dec 2026".
// The "T00:00" makes it local midnight; on its own the date would be read as UTC and could show the day before.
export function formatDisplayDate(date: string): string {
  if (date === '') {
    return ''
  }
  return new Date(`${date}T00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
