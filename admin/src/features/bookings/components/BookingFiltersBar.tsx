import { Button } from '../../../shared/components/buttons/Button'
import { SelectInput, type SelectOption } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../constants/paymentMethods'
import type { BookingFilters, BookingStatus, PaymentStatus } from '../types/booking'

type BookingFiltersBarProps = {
  filters: BookingFilters
  onChange: (filters: BookingFilters) => void
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'quote_requested', label: BOOKING_STATUS_LABELS.quote_requested },
  { value: 'pending', label: BOOKING_STATUS_LABELS.pending },
  { value: 'confirmed', label: BOOKING_STATUS_LABELS.confirmed },
  { value: 'completed', label: BOOKING_STATUS_LABELS.completed },
  { value: 'cancelled', label: BOOKING_STATUS_LABELS.cancelled },
]

const PAYMENT_OPTIONS: SelectOption[] = [
  { value: '', label: 'All payments' },
  { value: 'pending', label: PAYMENT_STATUS_LABELS.pending },
  { value: 'partially_paid', label: PAYMENT_STATUS_LABELS.partially_paid },
  { value: 'paid', label: PAYMENT_STATUS_LABELS.paid },
]

const emptyFilters: BookingFilters = { status: '', paymentStatus: '', dateFrom: '', dateTo: '' }

// The filters above the bookings table: status, payment status and pickup date range
export function BookingFiltersBar({ filters, onChange }: BookingFiltersBarProps) {
  const hasFilters = filters.status !== '' || filters.paymentStatus !== '' || filters.dateFrom !== '' || filters.dateTo !== ''

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <SelectInput
        id="filterStatus"
        options={STATUS_OPTIONS}
        required={false}
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value as BookingStatus | '' })}
      />
      <SelectInput
        id="filterPayment"
        options={PAYMENT_OPTIONS}
        required={false}
        value={filters.paymentStatus}
        onChange={(event) => onChange({ ...filters, paymentStatus: event.target.value as PaymentStatus | '' })}
      />
      <TextInput
        id="filterDateFrom"
        type="date"
        aria-label="Pickup date from"
        value={filters.dateFrom}
        onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })}
      />
      <TextInput
        id="filterDateTo"
        type="date"
        aria-label="Pickup date to"
        value={filters.dateTo}
        onChange={(event) => onChange({ ...filters, dateTo: event.target.value })}
      />
      {hasFilters && (
        <Button variant="secondary" onClick={() => onChange(emptyFilters)}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
