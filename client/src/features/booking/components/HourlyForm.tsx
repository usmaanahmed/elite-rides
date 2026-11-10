import { zodResolver } from '@hookform/resolvers/zod'
import { Hourglass, Luggage, MapPin, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { DURATION_OPTIONS, LUGGAGE_OPTIONS } from '../constants/bookingOptions'
import { FIELD_CONTROL_CLASSES } from '../constants/fieldStyles'
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete'
import { hourlyFormSchema, type HourlyFormValues } from '../schemas/hourlyFormSchema'
import { buildNumberOptions } from '../utils/buildNumberOptions'
import type { JourneyDetails } from '../types/journey'
import { buildHourlyDefaults } from '../utils/buildFormDefaults'
import { getTodayDateString } from '../utils/getTodayDateString'
import { AddressSuggestionList } from './AddressSuggestionList'
import { DateField } from './DateField'
import { FieldBox } from './FieldBox'
import { SelectField } from './SelectField'
import { SubmitButton } from './SubmitButton'
import { TimeField } from './TimeField'

type HourlyFormProps = {
  // Gets the checked form values once everything is valid
  onSubmit: (values: HourlyFormValues) => void
  // Most passengers one booking can have (from the admin settings)
  maxPassengers: number
  // The journey entered before (when the customer comes back to change it), or null
  savedJourney: JourneyDetails | null
}

// The pickup box is 60px tall; the suggestions open just under it
const PICKUP_BOX_HEIGHT = 60

// "By the hour" tab: a chauffeur stays with the customer for a set number of hours
export function HourlyForm({ onSubmit, maxPassengers, savedJourney }: HourlyFormProps) {
  const passengerOptions = buildNumberOptions(1, maxPassengers, 1, false, '')
  const autocomplete = useAddressAutocomplete()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HourlyFormValues>({
    resolver: zodResolver(hourlyFormSchema),
    defaultValues: buildHourlyDefaults(savedJourney),
    mode: 'onTouched',
  })

  const pickupError = errors.pickup?.message

  // The customer picked a suggested address
  function handleAddressSelect(address: string): void {
    setValue('pickup', address, { shouldValidate: true, shouldDirty: true })
    autocomplete.finishSelection()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div className="relative">
        <FieldBox label="Pickup" htmlFor="hourly-pickup" icon={MapPin} error={pickupError}>
          <input
            id="hourly-pickup"
            type="text"
            placeholder="Address or postcode"
            autoComplete="off"
            aria-invalid={Boolean(pickupError)}
            aria-describedby={pickupError ? 'hourly-pickup-error' : undefined}
            className={`${FIELD_CONTROL_CLASSES} pr-4`}
            {...register('pickup', {
              onChange: (event: { target: { value: string } }) => autocomplete.changeText(event.target.value),
              onBlur: () => autocomplete.close(),
            })}
            onFocus={(event) => autocomplete.openFor({ name: 'pickup', rowIndex: 0 }, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                autocomplete.close()
              }
            }}
          />
        </FieldBox>

        {autocomplete.activeField && (
          <AddressSuggestionList
            savedAddresses={autocomplete.savedAddresses}
            googleAddresses={autocomplete.googleAddresses}
            top={PICKUP_BOX_HEIGHT + 6}
            onSelect={handleAddressSelect}
          />
        )}
      </div>

      <SelectField
        id="hourly-duration"
        label="Duration"
        icon={Hourglass}
        options={DURATION_OPTIONS}
        {...register('hours')}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <DateField
          id="hourly-pickup-date"
          label="Pickup date"
          min={getTodayDateString()}
          error={errors.pickupDate?.message}
          {...register('pickupDate')}
        />
        <TimeField
          id="hourly-pickup-time"
          label="Pickup time"
          hourField={register('pickupHour')}
          minuteField={register('pickupMinute')}
          error={errors.pickupHour?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          id="hourly-passengers"
          label="Passengers"
          icon={Users}
          options={passengerOptions}
          {...register('passengers')}
        />
        <SelectField
          id="hourly-luggage"
          label="Luggage"
          icon={Luggage}
          options={LUGGAGE_OPTIONS}
          {...register('luggage')}
        />
      </div>

      <SubmitButton label="Get quote & book" />
    </form>
  )
}
