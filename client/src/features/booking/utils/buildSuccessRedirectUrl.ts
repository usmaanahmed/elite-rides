import type { ConfirmedBooking } from '../types/publicApi'

// Builds the "Booking Success Redirect URL" from the admin settings with the booking's details added.
// Rules: booking_number is always sent, empty values are skipped, email and phone are NEVER sent,
// and any query string already in the URL is kept. Gives null if the URL is not valid.
export function buildSuccessRedirectUrl(baseUrl: string, booking: ConfirmedBooking): string | null {
  let url: URL
  try {
    url = new URL(baseUrl)
  } catch {
    return null
  }

  url.searchParams.set('booking_number', booking.bookingNumber)

  const values: [string, string][] = [
    ['customer_name', booking.customerName],
    ['trip_type', booking.tripType],
    ['pickup', booking.pickup],
    ['dropoff', booking.dropoff],
    ['via', booking.via.join('|')],
    ['pickup_date', booking.pickupDate],
    ['pickup_time', booking.pickupTime],
    ['passengers', String(booking.passengers)],
    ['vehicle', booking.vehicleName],
    ['flight_no', booking.flightNo],
    ['arrival_from', booking.arrivalFrom],
    ['return_date', booking.returnDate],
    ['return_time', booking.returnTime],
    ['payment_method', booking.paymentMethod],
    ['payment_status', booking.paymentStatus],
    ['currency', booking.currency],
    ['total_amount', booking.total.toFixed(2)],
    ['amount_paid', booking.amountPaid.toFixed(2)],
    ['balance_due', booking.balanceDue.toFixed(2)],
  ]

  if (booking.tripType === 'hourly') {
    values.push(['hourly_duration', String(booking.hourlyDuration)])
  } else {
    values.push(['distance', String(booking.distanceMiles)])
  }

  for (const [name, value] of values) {
    if (value !== '') {
      url.searchParams.set(name, value)
    }
  }

  return url.toString()
}
