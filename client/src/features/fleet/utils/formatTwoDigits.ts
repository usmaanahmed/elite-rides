// Shows a number with at least two digits, e.g. for "01 / 06".
// 1 -> "01", 6 -> "06", 12 -> "12"
export function formatTwoDigits(value: number): string {
  if (value < 10) {
    return '0' + value
  }
  return String(value)
}
