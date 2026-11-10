// Turns a Date into "YYYY-MM-DD" in the visitor's own time zone, the format <input type="date"> uses.
// (toISOString() isn't used because it gives the UTC date, which can be a day out.)
export function formatDateString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
