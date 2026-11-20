// Link to a tour's detail page, e.g. "/tours/6af88c0bdf35456df38b4292"
export function buildTourLink(tourId: string): string {
  return '/tours/' + encodeURIComponent(tourId)
}
