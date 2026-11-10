import type { SelectOption } from '../types/booking'

// Builds dropdown options for a range of numbers, e.g. 0 to 55 in steps of 5.
// `labelSuffix` is added after the number in the visible text, e.g. " hours" -> "2 hours".
// When `padToTwoDigits` is true, 5 becomes "05" (needed for the time dropdowns).
export function buildNumberOptions(
  start: number,
  end: number,
  step: number,
  padToTwoDigits: boolean,
  labelSuffix: string,
): SelectOption[] {
  const options: SelectOption[] = []

  for (let number = start; number <= end; number = number + step) {
    let text = String(number)
    if (padToTwoDigits) {
      text = text.padStart(2, '0')
    }
    options.push({ value: text, label: text + labelSuffix })
  }

  return options
}
