// Turns the saved date into text like "27 Nov 2026" (empty text when there is no date)
export function formatBlogDate(dateText: string | null): string {
  if (dateText === null) {
    return ''
  }
  const date = new Date(dateText)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
