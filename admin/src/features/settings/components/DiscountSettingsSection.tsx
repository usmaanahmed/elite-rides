import { useFormContext } from 'react-hook-form'
import { FormField } from '../../../shared/components/forms/FormField'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { SettingsFormValues } from '../types/settings'
import { SettingsSection } from './SettingsSection'

const discountTypeOptions = [
  { value: 'none', label: 'No discount' },
  { value: 'fixed', label: 'Fixed amount (£)' },
  { value: 'percent', label: 'Percentage (%)' },
]

// Global discount (really lowers the fare) and pretend discount (only a crossed-out price)
export function DiscountSettingsSection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SettingsFormValues>()
  const discountErrors = errors.discount
  const globalType = watch('discount.globalDiscountType')
  const pretendType = watch('discount.pretendDiscountType')

  return (
    <SettingsSection title="Discount" description="Discounts applied to fares.">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Global discount type" htmlFor="globalDiscountType" hint="Lowers every fare.">
          <SelectInput id="globalDiscountType" options={discountTypeOptions} {...register('discount.globalDiscountType')} />
        </FormField>
        <FormField label="Global discount amount" htmlFor="globalDiscountValue" error={discountErrors?.globalDiscountValue?.message}>
          <TextInput
            id="globalDiscountValue"
            inputMode="decimal"
            disabled={globalType === 'none'}
            prefix={globalType === 'fixed' ? '£' : undefined}
            suffix={globalType === 'percent' ? '%' : undefined}
            {...register('discount.globalDiscountValue')}
            hasError={!!discountErrors?.globalDiscountValue}
          />
        </FormField>
        <FormField label="Pretend discount type" htmlFor="pretendDiscountType" hint="Display only: shows a crossed-out price. The real fare does not change.">
          <SelectInput id="pretendDiscountType" options={discountTypeOptions} {...register('discount.pretendDiscountType')} />
        </FormField>
        <FormField label="Pretend discount amount" htmlFor="pretendDiscountValue" error={discountErrors?.pretendDiscountValue?.message}>
          <TextInput
            id="pretendDiscountValue"
            inputMode="decimal"
            disabled={pretendType === 'none'}
            prefix={pretendType === 'fixed' ? '£' : undefined}
            suffix={pretendType === 'percent' ? '%' : undefined}
            {...register('discount.pretendDiscountValue')}
            hasError={!!discountErrors?.pretendDiscountValue}
          />
        </FormField>
      </div>
    </SettingsSection>
  )
}
