import { formatMoney } from '../../../shared/utils/formatMoney'
import type { ConfirmedBooking } from '../types/publicApi'
import { formatDisplayDate } from '../utils/formatDisplayDate'

type ConfirmationDetailsListProps = {
  booking: ConfirmedBooking
}

// How the booking is being paid, in words
function getPaymentText(booking: ConfirmedBooking): string {
  if (booking.paymentStatus === 'paid') {
    return 'Paid by card'
  }
  if (booking.paymentMethod === 'pay_cash') {
    return `Pay ${formatMoney(booking.balanceDue)} to your driver`
  }
  return `Card payment of ${formatMoney(booking.balanceDue)} due`
}

// One "label: value" row of the list
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

// The journey, vehicle and payment details on the thank-you page
export function ConfirmationDetailsList({ booking }: ConfirmationDetailsListProps) {
  return (
    <dl className="space-y-2.5">
      <DetailRow label="Passenger" value={booking.customerName} />
      <DetailRow label="Pickup" value={`${formatDisplayDate(booking.pickupDate)} at ${booking.pickupTime}`} />
      <DetailRow label="From" value={booking.pickup} />
      {booking.via.map((stop, index) => (
        <DetailRow key={index} label={`Stop ${index + 1}`} value={stop} />
      ))}
      {booking.dropoff && <DetailRow label="To" value={booking.dropoff} />}
      {booking.tripType === 'return' && (
        <DetailRow label="Return" value={`${formatDisplayDate(booking.returnDate)} at ${booking.returnTime}`} />
      )}
      {booking.tripType === 'hourly' && <DetailRow label="Duration" value={`${booking.hourlyDuration} hours`} />}
      <DetailRow label="Passengers" value={String(booking.passengers)} />
      <DetailRow label="Vehicle" value={booking.vehicleName} />
      {booking.flightNo && <DetailRow label="Flight" value={booking.flightNo} />}
      <DetailRow label="Payment" value={getPaymentText(booking)} />
    </dl>
  )
}
