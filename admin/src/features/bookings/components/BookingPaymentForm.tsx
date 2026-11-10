import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { Alert } from '../../../shared/components/feedback/Alert'
import { SelectInput, type SelectOption } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { PAYMENT_STATUS_LABELS } from '../constants/paymentMethods'
import { useUpdatePayment } from '../hooks/useBookings'
import type { Booking, PaymentStatus } from '../types/booking'

type BookingPaymentFormProps = {
  booking: Booking
}

const PAYMENT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'pending', label: PAYMENT_STATUS_LABELS.pending },
  { value: 'partially_paid', label: PAYMENT_STATUS_LABELS.partially_paid },
  { value: 'paid', label: PAYMENT_STATUS_LABELS.paid },
]

// Lets the admin record a payment, e.g. cash taken in the car
export function BookingPaymentForm({ booking }: BookingPaymentFormProps) {
  const paymentMutation = useUpdatePayment()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(booking.paymentStatus)
  const [amountText, setAmountText] = useState(String(booking.amountPaid))
  const [fieldError, setFieldError] = useState('')

  // Cancelled bookings take no more payments
  if (booking.status === 'cancelled') {
    return null
  }

  function savePayment() {
    setFieldError('')
    let amountPaid = 0
    if (paymentStatus === 'partially_paid') {
      if (!/^\d+(\.\d{1,2})?$/.test(amountText.trim())) {
        setFieldError('Enter the amount like 20 or 12.50')
        return
      }
      amountPaid = Number(amountText)
    }
    paymentMutation.mutate({ bookingId: booking.id, paymentStatus, amountPaid })
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-ink">Payment</h3>
      {fieldError && <Alert variant="error" title={fieldError} />}
      {paymentMutation.isError && <Alert variant="error" title={paymentMutation.error.message} />}
      <div className="flex flex-wrap items-start gap-2.5">
        <div className="w-40">
          <SelectInput
            id="paymentStatus"
            options={PAYMENT_STATUS_OPTIONS}
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
          />
        </div>
        {paymentStatus === 'partially_paid' && (
          <div className="w-36">
            <TextInput
              id="amountPaid"
              inputMode="decimal"
              prefix="£"
              value={amountText}
              onChange={(event) => setAmountText(event.target.value)}
            />
          </div>
        )}
        <Button variant="secondary" onClick={savePayment} isLoading={paymentMutation.isPending}>
          Save
        </Button>
      </div>
    </div>
  )
}
