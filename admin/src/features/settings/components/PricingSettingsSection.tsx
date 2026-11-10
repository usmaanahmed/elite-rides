import { useFormContext } from 'react-hook-form'
import { FormField } from '../../../shared/components/forms/FormField'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import type { SettingsFormValues } from '../types/settings'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'

const setPriceOptions = [
  { value: 'per_vehicle', label: 'Per vehicle (each vehicle has its own rates)' },
  { value: 'single_price', label: 'Single price' },
]

// How prices are worked out and which payment options customers see
export function PricingSettingsSection() {
  const { register } = useFormContext<SettingsFormValues>()

  return (
    <SettingsSection title="Pricing config" description="How fares are calculated and which payment options are shown.">
      <SettingsToggle name="pricing.mileageBySlabs" label="Mileage by slabs" description="Use slab prices instead of per-mile bands." />
      <SettingsToggle name="pricing.roundOff" label="Round off" description="Round the final fare to the nearest whole pound." />
      <SettingsToggle name="pricing.showCard" label="Show card payment" description="Let customers pay online by card." />
      <SettingsToggle name="pricing.showPayInCar" label="Show pay in car" description="Let customers pay the driver." />

      <FormField label="Set price" htmlFor="setPrice">
        <SelectInput id="setPrice" options={setPriceOptions} {...register('pricing.setPrice')} />
      </FormField>
    </SettingsSection>
  )
}
