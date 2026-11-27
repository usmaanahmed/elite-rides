// Other pages (e.g. the airport page) can open the booking form with the pickup already filled in.
// They send it as `state={{ pickup: 'Heathrow Airport, ...' }}` on the <Link>.
// This reads it safely and gives an empty text when there is none.
export function getStartingPickup(locationState: unknown): string {
  if (typeof locationState !== 'object' || locationState === null) {
    return ''
  }
  if (!('pickup' in locationState)) {
    return ''
  }
  if (typeof locationState.pickup !== 'string') {
    return ''
  }
  return locationState.pickup
}
