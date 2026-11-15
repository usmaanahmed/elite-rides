// Link to an airport's detail page, e.g. "/airports/6af88c0bdf35456df38b4292"
export function buildAirportLink(airportId: string): string {
  return '/airports/' + encodeURIComponent(airportId)
}
