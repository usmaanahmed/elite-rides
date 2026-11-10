import { zodResolver } from '@hookform/resolvers/zod'
import { Luggage, Plus, Users } from 'lucide-react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { LUGGAGE_OPTIONS, MAX_STOPS } from '../constants/bookingOptions'
import { transferFormSchema, type TransferFormValues } from '../schemas/transferFormSchema'
import type { JourneyDetails } from '../types/journey'
import { buildTransferDefaults } from '../utils/buildFormDefaults'
import { buildNumberOptions } from '../utils/buildNumberOptions'
import { getTodayDateString } from '../utils/getTodayDateString'
import { DateField } from './DateField'
import { RouteFields, type AddressFieldName } from './RouteFields'
import { SelectField } from './SelectField'
import { SubmitButton } from './SubmitButton'
import { TimeField } from './TimeField'
import { ToggleSwitch } from './ToggleSwitch'

type TransferFormProps = {
  // Gets the checked form values once everything is valid
  onSubmit: (values: TransferFormValues) => void
  // Most passengers one booking can have (from the admin settings)
  maxPassengers: number
  // The journey entered before (when the customer comes back to change it), or null
  savedJourney: JourneyDetails | null
}

// "Transfer" tab: a trip from A to B, with optional stops and an optional return journey
export function TransferForm({ onSubmit, maxPassengers, savedJourney }: TransferFormProps) {
  const passengerOptions = buildNumberOptions(1, maxPassengers, 1, false, '')

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: buildTransferDefaults(savedJourney),
    mode: 'onTouched',
  })

  const stopsArray = useFieldArray({ control, name: 'stops' })
  const hasReturn = useWatch({ control, name: 'hasReturn' })
  const pickupDate = useWatch({ control, name: 'pickupDate' })
  const canAddStop = stopsArray.fields.length < MAX_STOPS

  function handleAddStop(): void {
    stopsArray.append({ address: '' })
  }

  function handleRemoveStop(index: number): void {
    stopsArray.remove(index)
  }

  // The customer picked a suggested address: put it in the box and clear any old error
  function handleAddressSelect(fieldName: AddressFieldName, address: string): void {
    setValue(fieldName, address, { shouldValidate: true, shouldDirty: true })
  }

  // Swaps the pickup and drop-off text, e.g. for the journey home
  function handleSwapLocations(): void {
    const pickup = getValues('pickup')
    const dropoff = getValues('dropoff')
    setValue('pickup', dropoff)
    setValue('dropoff', pickup)
    // Old messages belonged to the other field before the swap; they come back on the next submit if still needed
    clearErrors(['pickup', 'dropoff'])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <RouteFields
        register={register}
        errors={errors}
        stops={stopsArray.fields}
        onRemoveStop={handleRemoveStop}
        onSwap={handleSwapLocations}
        onAddressSelect={handleAddressSelect}
      />

      <div className="flex items-center justify-between gap-3 px-1">
        <button
          type="button"
          onClick={handleAddStop}
          disabled={!canAddStop}
          title={canAddStop ? undefined : `You can add up to ${MAX_STOPS} stops`}
          className="inline-flex h-9 items-center gap-1.5 rounded-full text-sm font-semibold text-accent-ink transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" strokeWidth={2.25} />
          Add stop
        </button>
        <ToggleSwitch label="Return journey" {...register('hasReturn')} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DateField
          id="transfer-pickup-date"
          label="Pickup date"
          min={getTodayDateString()}
          error={errors.pickupDate?.message}
          {...register('pickupDate')}
        />
        <TimeField
          id="transfer-pickup-time"
          label="Pickup time"
          hourField={register('pickupHour')}
          minuteField={register('pickupMinute')}
          error={errors.pickupHour?.message}
        />
      </div>

      {hasReturn && (
        <div className="grid gap-3 motion-safe:animate-fade-in sm:grid-cols-2">
          <DateField
            id="transfer-return-date"
            label="Return date"
            min={pickupDate}
            error={errors.returnDate?.message}
            {...register('returnDate')}
          />
          <TimeField
            id="transfer-return-time"
            label="Return time"
            hourField={register('returnHour')}
            minuteField={register('returnMinute')}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          id="transfer-passengers"
          label="Passengers"
          icon={Users}
          options={passengerOptions}
          {...register('passengers')}
        />
        <SelectField
          id="transfer-luggage"
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
