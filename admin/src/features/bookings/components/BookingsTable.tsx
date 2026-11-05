import { Eye, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import { PAYMENT_METHOD_LABELS } from '../constants/paymentMethods'
import type { Booking } from '../types/booking'
import { formatFare, formatPickupDateTime } from '../utils/formatBookingValues'

type BookingsTableProps = {
  bookings: Booking[]
  onView: (booking: Booking) => void
  onDelete: (booking: Booking) => void
}

export function BookingsTable({ bookings, onView, onDelete }: BookingsTableProps) {
  const columns: DataTableColumn<Booking>[] = [
    {
      key: 'orderNo',
      header: 'Order No.',
      getValue: (row) => row.orderNo,
      render: (row) => <span className="whitespace-nowrap font-semibold tabular-nums">{row.orderNo}</span>,
    },
    {
      key: 'passenger',
      header: 'Passenger',
      getValue: (row) => row.passengerName,
      render: (row) => <span className="whitespace-nowrap">{row.passengerName}</span>,
    },
    {
      key: 'pickupAt',
      header: 'Date & Time',
      // Sorted by the ISO value so dates sort in time order, not by day of the month
      getValue: (row) => row.pickupAt,
      render: (row) => {
        const { date, time } = formatPickupDateTime(row.pickupAt)
        return (
          <div className="whitespace-nowrap tabular-nums">
            {date}
            <span className="block text-muted">{time}</span>
          </div>
        )
      },
    },
    { key: 'pickup', header: 'Pick Up', getValue: (row) => row.pickupAddress, className: 'min-w-56' },
    { key: 'dropoff', header: 'Drop Off', getValue: (row) => row.dropoffAddress, className: 'min-w-56' },
    {
      key: 'vehicle',
      header: 'Vehicle',
      getValue: (row) => row.vehicleName,
      render: (row) => <span className="whitespace-nowrap">{row.vehicleName}</span>,
    },
    { key: 'payment', header: 'Payment', getValue: (row) => PAYMENT_METHOD_LABELS[row.paymentMethod] },
    {
      key: 'fare',
      header: 'Fare',
      getValue: (row) => row.fare,
      render: (row) => <span className="whitespace-nowrap font-medium">{formatFare(row.fare)}</span>,
      className: 'tabular-nums',
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={Eye} label={`View ${row.orderNo}`} onClick={() => onView(row)} />
          <IconButton
            icon={Trash2}
            label={`Delete ${row.orderNo}`}
            onClick={() => onDelete(row)}
            className="hover:bg-danger-soft hover:text-danger"
          />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <DataTable
      rows={bookings}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'orderNo', direction: 'asc' }}
      searchPlaceholder="Search bookings…"
    />
  )
}
