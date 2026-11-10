import { Eye } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '../constants/paymentMethods'
import type { Booking } from '../types/booking'
import { formatFare, formatPickupDateAndTime } from '../utils/formatBookingValues'
import { BookingStatusBadge } from './BookingStatusBadge'

type BookingsTableProps = {
  bookings: Booking[]
  onView: (booking: Booking) => void
}

export function BookingsTable({ bookings, onView }: BookingsTableProps) {
  const columns: DataTableColumn<Booking>[] = [
    {
      key: 'bookingNumber',
      header: 'Order No.',
      getValue: (row) => row.bookingNumber,
      render: (row) => <span className="whitespace-nowrap font-semibold tabular-nums">{row.bookingNumber}</span>,
    },
    {
      key: 'passenger',
      header: 'Passenger',
      getValue: (row) => row.customer.name,
      render: (row) => <span className="whitespace-nowrap">{row.customer.name}</span>,
    },
    {
      key: 'pickupAt',
      header: 'Date & Time',
      // Sorted by "date time" text so dates sort in time order, not by day of the month
      getValue: (row) => `${row.pickupDate} ${row.pickupTime}`,
      render: (row) => {
        const { date, time } = formatPickupDateAndTime(row.pickupDate, row.pickupTime)
        return (
          <div className="whitespace-nowrap tabular-nums">
            {date}
            <span className="block text-muted">{time}</span>
          </div>
        )
      },
    },
    { key: 'pickup', header: 'Pick Up', getValue: (row) => row.pickup, className: 'min-w-56' },
    { key: 'dropoff', header: 'Drop Off', getValue: (row) => row.dropoff, className: 'min-w-56' },
    {
      key: 'vehicle',
      header: 'Vehicle',
      getValue: (row) => row.vehicleName,
      render: (row) => <span className="whitespace-nowrap">{row.vehicleName}</span>,
    },
    {
      key: 'payment',
      header: 'Payment',
      getValue: (row) => PAYMENT_METHOD_LABELS[row.paymentMethod],
      render: (row) => (
        <div className="whitespace-nowrap">
          {PAYMENT_METHOD_LABELS[row.paymentMethod]}
          <span className="block text-xs text-muted">{PAYMENT_STATUS_LABELS[row.paymentStatus]}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      getValue: (row) => row.status,
      render: (row) => <BookingStatusBadge status={row.status} />,
    },
    {
      key: 'fare',
      header: 'Fare',
      getValue: (row) => row.total,
      render: (row) => <span className="whitespace-nowrap font-medium">{formatFare(row.total)}</span>,
      className: 'tabular-nums',
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={Eye} label={`View ${row.bookingNumber}`} onClick={() => onView(row)} />
        </div>
      ),
      className: 'w-20',
    },
  ]

  return (
    <DataTable
      rows={bookings}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'pickupAt', direction: 'desc' }}
      searchPlaceholder="Search bookings…"
    />
  )
}
