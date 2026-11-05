// Matches a UK postcode area like "LU1" or "SW1A", optionally followed by the
// last part, e.g. "LU1 3QF". Case and spaces don't matter.
export const UK_POSTCODE_PATTERN = /^[A-Z]{1,2}\d[A-Z\d]?(\s*\d[A-Z]{2})?$/i

// Tidies a postcode the way it is normally written:
// " lu13qf " -> "LU1 3QF",  "lu1" -> "LU1"
export function formatPostcode(postcode: string): string {
  const compact = postcode.replace(/\s+/g, '').toUpperCase()

  // A postcode area is at most 4 characters. Anything longer is a full postcode,
  // whose last 3 characters are always written after a space.
  if (compact.length > 4) {
    return `${compact.slice(0, -3)} ${compact.slice(-3)}`
  }
  return compact
}
