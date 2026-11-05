import { PAYMENT_METHOD_LABELS } from '../constants/paymentMethods'
import type { Booking } from '../types/booking'
import { formatFare, formatPickupDateTime } from '../utils/formatBookingValues'

type BookingDetailsProps = {
  booking: Booking
}

// Every field of a booking as a label/value list, shown in the "View" dialog
export function BookingDetails({ booking }: BookingDetailsProps) {
  const { date, time } = formatPickupDateTime(booking.pickupAt)
  const details = [
    ['Order No.', booking.orderNo],
    ['Passenger', booking.passengerName],
    ['Date & Time', `${date} ${time}`],
    ['Pick Up', booking.pickupAddress],
    ['Drop Off', booking.dropoffAddress],
    ['Vehicle', booking.vehicleName],
    ['Payment', PAYMENT_METHOD_LABELS[booking.paymentMethod]],
    ['Fare', formatFare(booking.fare)],
  ]

  return (
    <dl className="divide-y divide-line text-sm">
      {details.map(([label, value]) => (
        <div key={label} className="grid grid-cols-3 gap-4 py-2.5 first:pt-0 last:pb-0">
          <dt className="text-muted">{label}</dt>
          <dd className="col-span-2 font-medium text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
