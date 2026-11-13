import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '../constants/paymentMethods'
import type { Booking } from '../types/booking'
import { formatFare, formatPickupDateAndTime } from '../utils/formatBookingValues'
import { BookingStatusBadge } from './BookingStatusBadge'

type BookingDetailsProps = {
  booking: Booking
}

const TRIP_TYPE_LABELS = {
  one_way: 'One way',
  return: 'Return',
  hourly: 'Hourly hire',
}

// Names of the extras the customer chose, e.g. "Baby seat × 1, Meet & greet"
function describeExtras(booking: Booking): string {
  const extras = booking.extras
  const names: string[] = []
  if (extras.babySeats > 0) names.push(`Baby seat × ${extras.babySeats}`)
  if (extras.boosterSeats > 0) names.push(`Booster seat × ${extras.boosterSeats}`)
  if (extras.meetAndGreet) names.push('Meet & greet')
  if (extras.extraLuggage > 0) names.push(`Extra luggage × ${extras.extraLuggage}`)
  if (extras.specialLuggage > 0) names.push(`Special luggage × ${extras.specialLuggage}`)
  if (extras.wheelchair) names.push('Wheelchair')
  if (extras.pet) names.push('Pet')

  if (names.length === 0) {
    return 'None'
  }
  return names.join(', ')
}

// Every field of a booking as a label/value list, then its price breakdown
export function BookingDetails({ booking }: BookingDetailsProps) {
  const pickup = formatPickupDateAndTime(booking.pickupDate, booking.pickupTime)

  const details: [string, string][] = [
    ['Passenger', booking.customer.name],
    ['Email', booking.customer.email],
    ['Phone', booking.customer.phone],
    ['Trip', TRIP_TYPE_LABELS[booking.tripType]],
    ['Date & Time', `${pickup.date} ${pickup.time}`],
    ['Pick Up', booking.pickup],
  ]
  if (booking.via.length > 0) {
    details.push(['Via', booking.via.join(' → ')])
  }
  if (booking.dropoff) {
    details.push(['Drop Off', booking.dropoff])
  }
  if (booking.tripType === 'return') {
    const returnTime = formatPickupDateAndTime(booking.returnDate, booking.returnTime)
    details.push(['Return', `${returnTime.date} ${returnTime.time}`])
  }
  if (booking.tripType === 'hourly') {
    details.push(['Duration', `${booking.hourlyDuration} hours`])
  } else {
    details.push(['Distance', `${booking.distanceMiles} miles`])
  }
  details.push(['Vehicle', booking.vehicleName])
  details.push(['Passengers', String(booking.passengers)])
  details.push(['Luggage', String(booking.luggage)])
  details.push(['Extras', describeExtras(booking)])
  if (booking.flightNo) {
    details.push(['Flight No.', booking.flightNo])
  }
  if (booking.arrivalFrom) {
    details.push(['Arriving from', booking.arrivalFrom])
  }
  details.push(['Payment', `${PAYMENT_METHOD_LABELS[booking.paymentMethod]} – ${PAYMENT_STATUS_LABELS[booking.paymentStatus]}`])
  if (booking.waitingMinutes > 0) {
    details.push(['Waiting time', `${booking.waitingMinutes} minutes`])
  }
  if (booking.notes) {
    details.push(['Notes', booking.notes])
  }

  return (
    <div className="space-y-5">
      <dl className="divide-y divide-line text-sm">
        <div className="grid grid-cols-3 gap-4 py-2.5 first:pt-0">
          <dt className="text-muted">Status</dt>
          <dd className="col-span-2">
            <BookingStatusBadge status={booking.status} />
          </dd>
        </div>
        {details.map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-4 py-2.5 last:pb-0">
            <dt className="text-muted">{label}</dt>
            <dd className="col-span-2 break-words font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <h3 className="text-sm font-semibold text-ink">Price</h3>
        <ul className="mt-2 divide-y divide-line text-sm">
          {booking.priceLines.map((line, index) => (
            <li key={index} className="flex justify-between gap-3 py-1.5">
              <span className="text-muted">{line.label}</span>
              <span className="tabular-nums text-ink">
                {line.amount < 0 ? '−' : ''}
                {formatFare(Math.abs(line.amount))}
              </span>
            </li>
          ))}
          <li className="flex justify-between gap-3 py-2 font-semibold text-ink">
            <span>Total</span>
            <span className="tabular-nums">{formatFare(booking.total)}</span>
          </li>
          <li className="flex justify-between gap-3 py-1.5 text-muted">
            <span>Paid</span>
            <span className="tabular-nums">{formatFare(booking.amountPaid)}</span>
          </li>
          <li className="flex justify-between gap-3 py-1.5 font-medium text-ink">
            <span>Balance due</span>
            <span className="tabular-nums">{formatFare(booking.balanceDue)}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
