import { useFormContext } from 'react-hook-form'
import { FormField } from '../../../shared/components/forms/FormField'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { SettingsFormValues } from '../types/settings'
import { SettingsSection } from './SettingsSection'

type ExtraFieldName = keyof SettingsFormValues['extras']

const extraFields: { name: ExtraFieldName; label: string }[] = [
  { name: 'babySeatPrice', label: 'Baby seat (per seat)' },
  { name: 'boosterSeatPrice', label: 'Booster seat (per seat)' },
  { name: 'meetAndGreetPrice', label: 'Meet & greet' },
  { name: 'luggagePrice', label: 'Extra luggage (per item)' },
  { name: 'specialLuggagePrice', label: 'Special luggage (per item)' },
  { name: 'wheelchairPrice', label: 'Wheelchair' },
  { name: 'returnExtraPrice', label: 'Return extra price' },
  { name: 'waitingPricePer5Minutes', label: 'Waiting (per 5 minutes)' },
]

// Prices of the optional extras a customer can add
export function ExtrasSettingsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsFormValues>()

  return (
    <SettingsSection title="Extras" description="Prices added to the fare when a customer picks an extra.">
      <div className="grid gap-5 sm:grid-cols-2">
        {extraFields.map((extra) => (
          <FormField key={extra.name} label={extra.label} htmlFor={extra.name} error={errors.extras?.[extra.name]?.message}>
            <TextInput
              id={extra.name}
              inputMode="decimal"
              prefix="£"
              {...register(`extras.${extra.name}`)}
              hasError={!!errors.extras?.[extra.name]}
            />
          </FormField>
        ))}
      </div>
    </SettingsSection>
  )
}
