import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { Alert } from '../../../shared/components/feedback/Alert'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { useSetWaitingTime } from '../hooks/useBookings'
import type { Booking } from '../types/booking'

type BookingWaitingFormProps = {
  booking: Booking
}

// Lets the admin add the waiting time after a job. The charge is added to the total.
export function BookingWaitingForm({ booking }: BookingWaitingFormProps) {
  const waitingMutation = useSetWaitingTime()
  const [minutesText, setMinutesText] = useState(String(booking.waitingMinutes))
  const [fieldError, setFieldError] = useState('')

  // Only jobs that are confirmed or finished can have waiting time
  if (booking.status !== 'confirmed' && booking.status !== 'completed') {
    return null
  }

  function saveWaitingTime() {
    setFieldError('')
    if (!/^\d+$/.test(minutesText.trim())) {
      setFieldError('Enter the minutes as a whole number')
      return
    }
    waitingMutation.mutate({ bookingId: booking.id, minutes: Number(minutesText) })
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-ink">Waiting time</h3>
      {fieldError && <Alert variant="error" title={fieldError} />}
      {waitingMutation.isError && <Alert variant="error" title={waitingMutation.error.message} />}
      <div className="flex items-start gap-2.5">
        <div className="w-36">
          <TextInput
            id="waitingMinutes"
            inputMode="numeric"
            suffix="min"
            value={minutesText}
            onChange={(event) => setMinutesText(event.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={saveWaitingTime} isLoading={waitingMutation.isPending}>
          Save
        </Button>
      </div>
    </div>
  )
}
