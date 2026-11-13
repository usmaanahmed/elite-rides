import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '../../../shared/components/buttons/Button'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { SettingsFormValues } from '../types/settings'

// Shared rates used by every vehicle when "Set price" is "Single price".
// Shows slab bands when "Mileage by slabs" is on, otherwise per-mile bands.
export function SingleRatesFields() {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<SettingsFormValues>()

  const mileageBySlabs = useWatch({ control, name: 'pricing.mileageBySlabs' })
  const mileageBandsArray = useFieldArray({ control, name: 'pricing.singleRates.mileageBands' })
  const slabBandsArray = useFieldArray({ control, name: 'pricing.singleRates.slabBands' })

  const singleRatesErrors = errors.pricing?.singleRates

  // The next band's "from" picks up where the last one's "to" left off
  function addMileageBand() {
    const lastIndex = mileageBandsArray.fields.length - 1
    let fromMiles = '1'
    if (lastIndex >= 0) {
      fromMiles = getValues(`pricing.singleRates.mileageBands.${lastIndex}.toMiles`)
    }
    mileageBandsArray.append({ fromMiles: fromMiles, toMiles: '', ratePerMile: '' })
  }

  function addSlabBand() {
    const lastIndex = slabBandsArray.fields.length - 1
    let fromMiles = '1'
    if (lastIndex >= 0) {
      fromMiles = getValues(`pricing.singleRates.slabBands.${lastIndex}.toMiles`)
    }
    slabBandsArray.append({ fromMiles: fromMiles, toMiles: '', price: '' })
  }

  let bandsErrorMessage = ''
  if (mileageBySlabs && typeof singleRatesErrors?.slabBands?.message === 'string') {
    bandsErrorMessage = singleRatesErrors.slabBands.message
  }
  if (!mileageBySlabs && typeof singleRatesErrors?.mileageBands?.message === 'string') {
    bandsErrorMessage = singleRatesErrors.mileageBands.message
  }

  return (
    <div className="space-y-4 rounded-xl border border-line p-4">
      <p className="text-sm text-muted">
        Every vehicle uses these rates. Each vehicle's own premium (Calculation Format) is still added on top.
      </p>

      <FormField label="Base fare" htmlFor="singleFixedPrice" hint="Added on top of the distance fare." error={singleRatesErrors?.fixedPrice?.message}>
        <TextInput id="singleFixedPrice" inputMode="decimal" placeholder="0.00" prefix="£" {...register('pricing.singleRates.fixedPrice')} hasError={!!singleRatesErrors?.fixedPrice} />
      </FormField>

      {bandsErrorMessage && <Alert variant="error" title={bandsErrorMessage} />}

      {!mileageBySlabs &&
        mileageBandsArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2.5 rounded-xl border border-line p-3">
            <FormField label="From" htmlFor={`singleMileageFrom${index}`} error={singleRatesErrors?.mileageBands?.[index]?.fromMiles?.message} className="w-20">
              <TextInput id={`singleMileageFrom${index}`} inputMode="numeric" suffix="mi" {...register(`pricing.singleRates.mileageBands.${index}.fromMiles`)} hasError={!!singleRatesErrors?.mileageBands?.[index]?.fromMiles} />
            </FormField>
            <FormField label="To" htmlFor={`singleMileageTo${index}`} error={singleRatesErrors?.mileageBands?.[index]?.toMiles?.message} className="w-20">
              <TextInput id={`singleMileageTo${index}`} inputMode="numeric" suffix="mi" {...register(`pricing.singleRates.mileageBands.${index}.toMiles`)} hasError={!!singleRatesErrors?.mileageBands?.[index]?.toMiles} />
            </FormField>
            <FormField label="Rate per mile" htmlFor={`singleMileageRate${index}`} error={singleRatesErrors?.mileageBands?.[index]?.ratePerMile?.message} className="flex-1">
              <TextInput id={`singleMileageRate${index}`} inputMode="decimal" prefix="£" {...register(`pricing.singleRates.mileageBands.${index}.ratePerMile`)} hasError={!!singleRatesErrors?.mileageBands?.[index]?.ratePerMile} />
            </FormField>
            <Button type="button" variant="ghost" onClick={() => mileageBandsArray.remove(index)} className="mb-0.5 text-danger hover:bg-danger-soft">
              <Trash2 className="size-4" strokeWidth={2} />
            </Button>
          </div>
        ))}

      {mileageBySlabs &&
        slabBandsArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2.5 rounded-xl border border-line p-3">
            <FormField label="From" htmlFor={`singleSlabFrom${index}`} error={singleRatesErrors?.slabBands?.[index]?.fromMiles?.message} className="w-20">
              <TextInput id={`singleSlabFrom${index}`} inputMode="numeric" suffix="mi" {...register(`pricing.singleRates.slabBands.${index}.fromMiles`)} hasError={!!singleRatesErrors?.slabBands?.[index]?.fromMiles} />
            </FormField>
            <FormField label="To" htmlFor={`singleSlabTo${index}`} error={singleRatesErrors?.slabBands?.[index]?.toMiles?.message} className="w-20">
              <TextInput id={`singleSlabTo${index}`} inputMode="numeric" suffix="mi" {...register(`pricing.singleRates.slabBands.${index}.toMiles`)} hasError={!!singleRatesErrors?.slabBands?.[index]?.toMiles} />
            </FormField>
            <FormField label="Flat price" htmlFor={`singleSlabPrice${index}`} error={singleRatesErrors?.slabBands?.[index]?.price?.message} className="flex-1">
              <TextInput id={`singleSlabPrice${index}`} inputMode="decimal" prefix="£" {...register(`pricing.singleRates.slabBands.${index}.price`)} hasError={!!singleRatesErrors?.slabBands?.[index]?.price} />
            </FormField>
            <Button type="button" variant="ghost" onClick={() => slabBandsArray.remove(index)} className="mb-0.5 text-danger hover:bg-danger-soft">
              <Trash2 className="size-4" strokeWidth={2} />
            </Button>
          </div>
        ))}

      <Button type="button" variant="secondary" icon={Plus} onClick={mileageBySlabs ? addSlabBand : addMileageBand}>
        Add item
      </Button>
    </div>
  )
}
