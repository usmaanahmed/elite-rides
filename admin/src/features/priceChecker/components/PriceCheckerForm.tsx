import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../shared/components/buttons/Button'
import { Card } from '../../../shared/components/cards/Card'
import { FormField } from '../../../shared/components/forms/FormField'
import { SelectInput, type SelectOption } from '../../../shared/components/inputs/SelectInput'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { priceCheckerFormSchema } from '../schemas/priceCheckerFormSchema'
import type { PriceCheckerFormValues, QuoteRequest } from '../types/quote'

type PriceCheckerFormProps = {
  isLoading: boolean
  // Called with the request once every field has passed validation
  onSubmitQuote: (request: QuoteRequest) => void
}

const TRIP_TYPE_OPTIONS: SelectOption[] = [
  { value: 'one_way', label: 'One way' },
  { value: 'return', label: 'Return' },
  { value: 'hourly', label: 'Hourly hire' },
]

const defaultValues: PriceCheckerFormValues = {
  tripType: 'one_way',
  pickup: '',
  via: '',
  dropoff: '',
  pickupDate: '',
  pickupTime: '',
  returnDate: '',
  returnTime: '',
  hourlyDuration: '',
  passengers: '1',
  babySeats: '0',
  boosterSeats: '0',
  extraLuggage: '0',
  specialLuggage: '0',
  meetAndGreet: false,
  wheelchair: false,
  couponCode: '',
}

// Turns the "one stop per line" text into a list, ignoring empty lines
function splitViaStops(viaText: string): string[] {
  const stops: string[] = []
  for (const line of viaText.split('\n')) {
    const stop = line.trim()
    if (stop !== '') {
      stops.push(stop)
    }
  }
  return stops
}

// The form where the admin enters a journey to see what it would cost
export function PriceCheckerForm({ isLoading, onSubmitQuote }: PriceCheckerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PriceCheckerFormValues>({
    resolver: zodResolver(priceCheckerFormSchema),
    defaultValues: defaultValues,
    mode: 'onTouched',
  })

  const tripType = watch('tripType')

  function submitForm(values: PriceCheckerFormValues) {
    const isHourly = values.tripType === 'hourly'
    const isReturn = values.tripType === 'return'

    onSubmitQuote({
      tripType: values.tripType,
      pickup: values.pickup,
      via: splitViaStops(values.via),
      dropoff: isHourly ? '' : values.dropoff,
      pickupDate: values.pickupDate,
      pickupTime: values.pickupTime,
      returnDate: isReturn ? values.returnDate : '',
      returnTime: isReturn ? values.returnTime : '',
      hourlyDuration: isHourly ? Number(values.hourlyDuration) : 0,
      passengers: Number(values.passengers),
      extras: {
        babySeats: Number(values.babySeats),
        boosterSeats: Number(values.boosterSeats),
        meetAndGreet: values.meetAndGreet,
        extraLuggage: Number(values.extraLuggage),
        specialLuggage: Number(values.specialLuggage),
        wheelchair: values.wheelchair,
      },
      couponCode: values.couponCode,
      vehicleId: '',
    })
  }

  return (
    <Card>
      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <form onSubmit={handleSubmit(submitForm)} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Trip type" htmlFor="tripType" error={errors.tripType?.message}>
            <SelectInput id="tripType" options={TRIP_TYPE_OPTIONS} {...register('tripType')} />
          </FormField>

          <FormField label="Passengers" htmlFor="passengers" error={errors.passengers?.message}>
            <TextInput id="passengers" inputMode="numeric" {...register('passengers')} hasError={!!errors.passengers} />
          </FormField>
        </div>

        <FormField label="Pickup address" htmlFor="pickup" error={errors.pickup?.message}>
          <TextInput
            id="pickup"
            placeholder="e.g. Heathrow Airport, Longford TW6 1EW"
            autoComplete="off"
            {...register('pickup')}
            hasError={!!errors.pickup}
          />
        </FormField>

        <FormField label="Via stops (optional)" htmlFor="via" hint="One stop per line." error={errors.via?.message}>
          <TextArea id="via" rows={2} {...register('via')} hasError={!!errors.via} />
        </FormField>

        {tripType !== 'hourly' && (
          <FormField label="Dropoff address" htmlFor="dropoff" error={errors.dropoff?.message}>
            <TextInput
              id="dropoff"
              placeholder="e.g. 10 Downing Street, London SW1A 2AA"
              autoComplete="off"
              {...register('dropoff')}
              hasError={!!errors.dropoff}
            />
          </FormField>
        )}

        {tripType === 'hourly' && (
          <FormField label="Hire duration (hours)" htmlFor="hourlyDuration" error={errors.hourlyDuration?.message}>
            <TextInput
              id="hourlyDuration"
              inputMode="decimal"
              {...register('hourlyDuration')}
              hasError={!!errors.hourlyDuration}
            />
          </FormField>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Pickup date" htmlFor="pickupDate" error={errors.pickupDate?.message}>
            <TextInput id="pickupDate" type="date" {...register('pickupDate')} hasError={!!errors.pickupDate} />
          </FormField>
          <FormField label="Pickup time" htmlFor="pickupTime" error={errors.pickupTime?.message}>
            <TextInput id="pickupTime" type="time" {...register('pickupTime')} hasError={!!errors.pickupTime} />
          </FormField>
        </div>

        {tripType === 'return' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Return date" htmlFor="returnDate" error={errors.returnDate?.message}>
              <TextInput id="returnDate" type="date" {...register('returnDate')} hasError={!!errors.returnDate} />
            </FormField>
            <FormField label="Return time" htmlFor="returnTime" error={errors.returnTime?.message}>
              <TextInput id="returnTime" type="time" {...register('returnTime')} hasError={!!errors.returnTime} />
            </FormField>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-ink">Extras</h3>
          <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <FormField label="Baby seats" htmlFor="babySeats" error={errors.babySeats?.message}>
              <TextInput id="babySeats" inputMode="numeric" {...register('babySeats')} hasError={!!errors.babySeats} />
            </FormField>
            <FormField label="Booster seats" htmlFor="boosterSeats" error={errors.boosterSeats?.message}>
              <TextInput
                id="boosterSeats"
                inputMode="numeric"
                {...register('boosterSeats')}
                hasError={!!errors.boosterSeats}
              />
            </FormField>
            <FormField label="Extra luggage" htmlFor="extraLuggage" error={errors.extraLuggage?.message}>
              <TextInput
                id="extraLuggage"
                inputMode="numeric"
                {...register('extraLuggage')}
                hasError={!!errors.extraLuggage}
              />
            </FormField>
            <FormField label="Special luggage" htmlFor="specialLuggage" error={errors.specialLuggage?.message}>
              <TextInput
                id="specialLuggage"
                inputMode="numeric"
                {...register('specialLuggage')}
                hasError={!!errors.specialLuggage}
              />
            </FormField>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" className="size-4 accent-accent" {...register('meetAndGreet')} />
              Meet &amp; greet
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" className="size-4 accent-accent" {...register('wheelchair')} />
              Wheelchair
            </label>
          </div>
        </div>

        <FormField label="Coupon code (optional)" htmlFor="couponCode" error={errors.couponCode?.message}>
          <TextInput id="couponCode" autoComplete="off" {...register('couponCode')} hasError={!!errors.couponCode} />
        </FormField>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            Check price
          </Button>
        </div>
      </form>
    </Card>
  )
}
