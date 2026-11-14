// Turns an ISO date text into a short date, e.g. "2026-11-14T10:00:00.000Z" -> "14 Nov 2026"
export function formatBlogDate(isoDate: string | null): string {
  if (!isoDate) {
    return '—'
  }
  return new Date(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
