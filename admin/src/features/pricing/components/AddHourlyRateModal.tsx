import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { VEHICLE_TYPES } from '../../vehicles/constants/vehicleTypes'
import { addHourlyRate } from '../api/addHourlyRate'
import { hourlyRateFormSchema } from '../schemas/hourlyRateFormSchema'
import type { HourlyRateFormValues, NewHourlyRate } from '../types/hourlyRate'

type AddHourlyRateModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved rate after it has been added
  onHourlyRateAdded: (hourlyRate: NewHourlyRate) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-hourly-rate-form'

const emptyFormValues: HourlyRateFormValues = {
  vehicleTypeId: '',
  ratePerHour: '',
}

// The vehicle types, in the shape the dropdown expects
const vehicleOptions = VEHICLE_TYPES.map((vehicleType) => ({ value: vehicleType.id, label: vehicleType.name }))

export function AddHourlyRateModal({ isOpen, onClose, onHourlyRateAdded }: AddHourlyRateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<HourlyRateFormValues>({
    resolver: zodResolver(hourlyRateFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    reset()
    onClose()
  }

  // Only runs once every field has passed validation
  async function saveHourlyRate(values: HourlyRateFormValues) {
    const newHourlyRate: NewHourlyRate = {
      vehicleTypeId: values.vehicleTypeId,
      ratePerHour: Number(values.ratePerHour),
    }

    try {
      await addHourlyRate(newHourlyRate)
      onHourlyRateAdded(newHourlyRate)
      reset()
      onClose()
    } catch {
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message: 'The hourly rate could not be saved. Please try again.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add hourly rate"
      description="Set what a vehicle costs per hour for bookings charged by time."
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save hourly rate"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset()}
          onCancel={handleClose}
        />
      }
      // A stray click outside shouldn't throw away a half-filled form
      closeOnBackdropClick={!isDirty}
    >
      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <form id={FORM_ID} onSubmit={handleSubmit(saveHourlyRate)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField label="Vehicle" htmlFor="vehicleTypeId" error={errors.vehicleTypeId?.message}>
          <SelectInput
            id="vehicleTypeId"
            placeholder="Select a vehicle"
            options={vehicleOptions}
            {...register('vehicleTypeId')}
            hasError={!!errors.vehicleTypeId}
          />
        </FormField>

        <FormField label="Hourly rate" htmlFor="ratePerHour" error={errors.ratePerHour?.message}>
          <TextInput
            id="ratePerHour"
            inputMode="decimal"
            placeholder="0.00"
            prefix="£"
            suffix="per hour"
            {...register('ratePerHour')}
            hasError={!!errors.ratePerHour}
          />
        </FormField>
      </form>
    </Modal>
  )
}
