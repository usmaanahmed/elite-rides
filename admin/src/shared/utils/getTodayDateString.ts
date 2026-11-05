// Today's date in the user's own time zone as "YYYY-MM-DD", the format <input type="date"> uses.
// (toISOString() isn't used because it gives the UTC date, which can be a day out.)
export function getTodayDateString(): string {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}
