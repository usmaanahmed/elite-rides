// Small helpers to show the tour dates in a friendly way

// Turns "2027-01-12" into a Date at local midnight (on its own the text would be read as UTC)
function toLocalDate(date: string): Date {
  return new Date(`${date}T00:00`)
}

// "2027-01-12" -> "12 Jan 2027"
export function formatTourDate(date: string): string {
  return toLocalDate(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// The date of one day of the tour, e.g. start "2027-01-12" and Day 2 -> "Wed 13 Jan".
// Returns "" when the tour has no start date.
export function getDayDateText(startDate: string, dayNumber: number): string {
  if (startDate === '') {
    return ''
  }
  const date = toLocalDate(startDate)
  date.setDate(date.getDate() + dayNumber - 1)
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

// "12 Jan 2027 – 14 Jan 2027", or just one date when only one is set. "" when none is set.
export function getTourDateRangeText(startDate: string, endDate: string): string {
  if (startDate !== '' && endDate !== '' && startDate !== endDate) {
    return `${formatTourDate(startDate)} – ${formatTourDate(endDate)}`
  }
  if (startDate !== '') {
    return formatTourDate(startDate)
  }
  if (endDate !== '') {
    return formatTourDate(endDate)
  }
  return ''
}

// 1 -> "1 day", 3 -> "3 days"
export function getDurationText(durationDays: number): string {
  if (durationDays === 1) {
    return '1 day'
  }
  return `${durationDays} days`
}
