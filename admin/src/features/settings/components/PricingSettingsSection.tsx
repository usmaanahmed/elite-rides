import { useFormContext, useWatch } from 'react-hook-form'
import { FormField } from '../../../shared/components/forms/FormField'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import type { SettingsFormValues } from '../types/settings'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'
import { SingleRatesFields } from './SingleRatesFields'

const setPriceOptions = [
  { value: 'per_vehicle', label: 'Per vehicle (each vehicle has its own rates)' },
  { value: 'single_price', label: 'Single price' },
]

// How prices are worked out and which payment options customers see
export function PricingSettingsSection() {
  const { register, control } = useFormContext<SettingsFormValues>()
  const setPrice = useWatch({ control, name: 'pricing.setPrice' })

  return (
    <SettingsSection title="Pricing config" description="How fares are calculated and whether customers can pay by card.">
      <SettingsToggle name="pricing.mileageBySlabs" label="Mileage by slabs" description="Use slab prices instead of per-mile bands." />
      <SettingsToggle name="pricing.roundOff" label="Round off" description="Round the final fare to the nearest whole pound." />
      <SettingsToggle name="pricing.showCard" label="Show card payment" description="Let customers pay online by card." />

      <FormField label="Set price" htmlFor="setPrice">
        <SelectInput id="setPrice" options={setPriceOptions} {...register('pricing.setPrice')} />
      </FormField>

      {setPrice === 'single_price' && <SingleRatesFields />}
    </SettingsSection>
  )
}
