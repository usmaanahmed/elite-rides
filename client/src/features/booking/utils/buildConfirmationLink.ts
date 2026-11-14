import { ROUTES } from '../../../shared/constants/routes'

// The thank-you page link for one booking, e.g. "/booking/confirmation?ref=3fa9…".
// `reference` is the booking's secret code, so only the customer who booked has this link.
export function buildConfirmationLink(reference: string): string {
  return `${ROUTES.bookingConfirmation}?ref=${encodeURIComponent(reference)}`
}
