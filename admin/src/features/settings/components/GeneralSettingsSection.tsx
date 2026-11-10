import { useFormContext } from 'react-hook-form'
import { FormField } from '../../../shared/components/forms/FormField'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { SettingsFormValues } from '../types/settings'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'

// Booking rules: guest booking, limits, blocked dates and times
export function GeneralSettingsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsFormValues>()
  const generalErrors = errors.general

  return (
    <SettingsSection title="General" description="Booking rules and limits.">
      <SettingsToggle name="general.guestLogin" label="Guest booking" description="Allow booking without an account." />
      <SettingsToggle name="general.hourlyRateStatus" label="Hourly hire" description="Allow hourly bookings." />
      <SettingsToggle name="general.isQuotation" label="Quotation mode" description="Bookings become quote requests that you approve." />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Grace time" htmlFor="graceTimeMinutes" error={generalErrors?.graceTimeMinutes?.message}>
          <TextInput id="graceTimeMinutes" inputMode="numeric" suffix="minutes" {...register('general.graceTimeMinutes')} hasError={!!generalErrors?.graceTimeMinutes} />
        </FormField>
        <FormField label="Max passengers" htmlFor="maxPassengers" error={generalErrors?.maxPassengers?.message}>
          <TextInput id="maxPassengers" inputMode="numeric" {...register('general.maxPassengers')} hasError={!!generalErrors?.maxPassengers} />
        </FormField>
        <FormField label="Booking number prefix" htmlFor="bookingNumberPrefix" hint="e.g. ELR gives ELR001664" error={generalErrors?.bookingNumberPrefix?.message}>
          <TextInput id="bookingNumberPrefix" {...register('general.bookingNumberPrefix')} hasError={!!generalErrors?.bookingNumberPrefix} />
        </FormField>
        <FormField label="Success redirect URL" htmlFor="bookingSuccessRedirectUrl" isOptional error={generalErrors?.bookingSuccessRedirectUrl?.message}>
          <TextInput id="bookingSuccessRedirectUrl" {...register('general.bookingSuccessRedirectUrl')} hasError={!!generalErrors?.bookingSuccessRedirectUrl} />
        </FormField>
        <FormField label="Block dates from" htmlFor="blockDateFrom" isOptional>
          <TextInput id="blockDateFrom" type="date" {...register('general.blockDateFrom')} />
        </FormField>
        <FormField label="Block dates to" htmlFor="blockDateTo" isOptional error={generalErrors?.blockDateTo?.message}>
          <TextInput id="blockDateTo" type="date" {...register('general.blockDateTo')} hasError={!!generalErrors?.blockDateTo} />
        </FormField>
        <FormField label="Block time from" htmlFor="blockTimeFrom" isOptional hint="No pickups in this time window, e.g. 02:00 to 04:00.">
          <TextInput id="blockTimeFrom" type="time" {...register('general.blockTimeFrom')} />
        </FormField>
        <FormField label="Block time to" htmlFor="blockTimeTo" isOptional error={generalErrors?.blockTimeTo?.message}>
          <TextInput id="blockTimeTo" type="time" {...register('general.blockTimeTo')} hasError={!!generalErrors?.blockTimeTo} />
        </FormField>
      </div>
    </SettingsSection>
  )
}
