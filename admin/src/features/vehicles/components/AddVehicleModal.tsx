import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { ImageUpload } from '../../../shared/components/inputs/ImageUpload'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useAddVehicle } from '../hooks/useAddVehicle'
import {
  ALLOWED_IMAGE_TYPES,
  DESCRIPTION_MAX_LENGTH,
  MAX_IMAGE_SIZE_MB,
  vehicleFormSchema,
} from '../schemas/vehicleFormSchema'
import type { NewVehicle, Vehicle, VehicleFormValues } from '../types/vehicle'

type AddVehicleModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved vehicle after it has been added
  onVehicleAdded: (vehicle: Vehicle) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-vehicle-form'

const emptyFormValues: VehicleFormValues = {
  carName: '',
  description: '',
  passengerCapacity: '',
  luggageCapacity: '',
  handLuggageCapacity: '',
  discountRate: '',
  returnDiscountRate: '',
  carImage: null,
}

export function AddVehicleModal({ isOpen, onClose, onVehicleAdded }: AddVehicleModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  // Saves the vehicle on the server and refreshes the vehicles list
  const addVehicleMutation = useAddVehicle()

  // Read the description as it is typed, for the character counter
  const description = useWatch({ control, name: 'description' })

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    reset()
    onClose()
  }

  // Only runs once every field has passed validation
  async function saveVehicle(values: VehicleFormValues) {
    // Validation already makes sure an image is chosen; this check just tells TypeScript that too
    if (!values.carImage) return

    const newVehicle: NewVehicle = {
      name: values.carName,
      description: values.description,
      passengerCapacity: Number(values.passengerCapacity),
      luggageCapacity: Number(values.luggageCapacity),
      handLuggageCapacity: Number(values.handLuggageCapacity),
      discountRate: Number(values.discountRate),
      returnDiscountRate: Number(values.returnDiscountRate),
      image: values.carImage,
    }

    try {
      const savedVehicle = await addVehicleMutation.mutateAsync(newVehicle)
      onVehicleAdded(savedVehicle)
      reset()
      onClose()
    } catch (error) {
      // Show the server's message (e.g. "Image must be 2 MB or smaller") when there is one
      let message = 'The vehicle could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add vehicle"
      description="Add a vehicle type customers can book."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save vehicle"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveVehicle)} noValidate className="space-y-8">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormSection title="Vehicle details">
          <div className="grid gap-4">
            <FormField label="Car name" htmlFor="carName" error={errors.carName?.message}>
              <TextInput id="carName" placeholder="e.g. Saloon, Estate, MPV" {...register('carName')} hasError={!!errors.carName} />
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              error={errors.description?.message}
              isOptional
              labelExtra={
                <span className={`text-xs tabular-nums ${description.length > DESCRIPTION_MAX_LENGTH ? 'text-danger' : 'text-muted'}`}>
                  {description.length} / {DESCRIPTION_MAX_LENGTH}
                </span>
              }
            >
              <TextArea
                id="description"
                placeholder="A short description customers see when booking"
                {...register('description')}
                hasError={!!errors.description}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Capacity" description="How many passengers and bags this vehicle can carry.">
          {/* inputMode brings up the number keypad on phones while keeping a plain text box */}
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Passengers" htmlFor="passengerCapacity" error={errors.passengerCapacity?.message}>
              <TextInput
                id="passengerCapacity"
                inputMode="numeric"
                placeholder="4"
                suffix="seats"
                {...register('passengerCapacity')}
                hasError={!!errors.passengerCapacity}
              />
            </FormField>

            <FormField label="Luggage" htmlFor="luggageCapacity" error={errors.luggageCapacity?.message}>
              <TextInput
                id="luggageCapacity"
                inputMode="numeric"
                placeholder="2"
                suffix="bags"
                {...register('luggageCapacity')}
                hasError={!!errors.luggageCapacity}
              />
            </FormField>

            <FormField label="Hand luggage" htmlFor="handLuggageCapacity" error={errors.handLuggageCapacity?.message}>
              <TextInput
                id="handLuggageCapacity"
                inputMode="numeric"
                placeholder="2"
                suffix="bags"
                {...register('handLuggageCapacity')}
                hasError={!!errors.handLuggageCapacity}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Discounts">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Discount rate"
              htmlFor="discountRate"
              hint="Taken off one-way journeys."
              error={errors.discountRate?.message}
            >
              <TextInput
                id="discountRate"
                inputMode="decimal"
                placeholder="0"
                suffix="%"
                {...register('discountRate')}
                hasError={!!errors.discountRate}
              />
            </FormField>

            <FormField
              label="Return discount rate"
              htmlFor="returnDiscountRate"
              hint="Taken off return journeys."
              error={errors.returnDiscountRate?.message}
            >
              <TextInput
                id="returnDiscountRate"
                inputMode="decimal"
                placeholder="0"
                suffix="%"
                {...register('returnDiscountRate')}
                hasError={!!errors.returnDiscountRate}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Photo">
          <FormField label="Car image" htmlFor="carImage" error={errors.carImage?.message}>
            {/* Controller connects inputs that aren't a plain text box (here, a file picker) to the form */}
            <Controller
              name="carImage"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  id="carImage"
                  ref={field.ref}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  hasError={!!errors.carImage}
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                  hint={`JPG, PNG or WEBP · up to ${MAX_IMAGE_SIZE_MB} MB`}
                />
              )}
            />
          </FormField>
        </FormSection>
      </form>
    </Modal>
  )
}
