import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { SegmentedControl } from '../../../shared/components/inputs/SegmentedControl'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useUpdateCalculationFormat } from '../hooks/useUpdateCalculationFormat'
import { calculationFormatFormSchema } from '../schemas/calculationFormatFormSchema'
import type { CalculationFormatFormValues, CalculationFormatItem, Vehicle } from '../types/vehicle'

type CalculationFormatModalProps = {
  isOpen: boolean
  onClose: () => void
  vehicles: Vehicle[]
  onSaved: () => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'calculation-format-form'

const premiumTypeOptions = [
  { value: 'fixed', label: '£' },
  { value: 'percent', label: '%' },
]

function toFormValues(vehicles: Vehicle[]): CalculationFormatFormValues {
  return {
    items: vehicles.map((vehicle) => ({
      type: vehicle.calculationFormat.type,
      value: String(vehicle.calculationFormat.value),
    })),
  }
}

export function CalculationFormatModal({ isOpen, onClose, vehicles, onSaved }: CalculationFormatModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CalculationFormatFormValues>({
    resolver: zodResolver(calculationFormatFormSchema),
    defaultValues: toFormValues(vehicles),
    mode: 'onTouched',
  })

  const updateCalculationFormatMutation = useUpdateCalculationFormat()

  // Reload each vehicle's current values whenever the modal is opened, in case they changed since last time
  useEffect(() => {
    if (isOpen) reset(toFormValues(vehicles))
  }, [isOpen, vehicles, reset])

  function handleClose() {
    if (isSubmitting) return
    onClose()
  }

  async function save(values: CalculationFormatFormValues) {
    const items: CalculationFormatItem[] = values.items.map((item, index) => ({
      vehicleId: vehicles[index].id,
      type: item.type,
      value: Number(item.value),
    }))

    try {
      await updateCalculationFormatMutation.mutateAsync(items)
      onSaved()
      onClose()
    } catch (error) {
      let message = 'The calculation format could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      setError('root', { message })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add calculation format"
      description="Set how much more each vehicle costs than the base fare. The base vehicle is usually £0."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset(toFormValues(vehicles))}
          onCancel={handleClose}
        />
      }
      closeOnBackdropClick={!isDirty}
    >
      <form id={FORM_ID} onSubmit={handleSubmit(save)} noValidate className="space-y-4">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        {vehicles.map((vehicle, index) => (
          <div key={vehicle.id} className="flex items-end gap-3 rounded-xl border border-line p-3">
            <p className="flex-1 pb-2.5 text-sm font-medium text-ink">{vehicle.name}</p>

            <Controller
              name={`items.${index}.type`}
              control={control}
              render={({ field }) => (
                <SegmentedControl label={`${vehicle.name} premium type`} options={premiumTypeOptions} value={field.value} onChange={field.onChange} />
              )}
            />

            <FormField label="Value" htmlFor={`premiumValue${index}`} error={errors.items?.[index]?.value?.message} className="w-32">
              <TextInput id={`premiumValue${index}`} inputMode="decimal" placeholder="0" {...register(`items.${index}.value`)} hasError={!!errors.items?.[index]?.value} />
            </FormField>
          </div>
        ))}
      </form>
    </Modal>
  )
}
