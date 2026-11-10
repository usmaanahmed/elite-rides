import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { ImageUpload } from '../../../shared/components/inputs/ImageUpload'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useEditVehicle } from '../hooks/useEditVehicle'
import { DESCRIPTION_MAX_LENGTH, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../schemas/vehicleFormSchema'
import { editVehicleFormSchema } from '../schemas/editVehicleFormSchema'
import type { EditVehicleFormValues, Vehicle, VehicleUpdate } from '../types/vehicle'

type EditVehicleModalProps = {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
  // Called with the saved vehicle after it has been updated
  onVehicleUpdated: (vehicle: Vehicle) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'edit-vehicle-form'

function toFormValues(vehicle: Vehicle): EditVehicleFormValues {
  return {
    carName: vehicle.name,
    description: vehicle.description,
    passengerCapacity: String(vehicle.passengerCapacity),
    luggageCapacity: String(vehicle.luggageCapacity),
    handLuggageCapacity: String(vehicle.handLuggageCapacity),
    discountRate: String(vehicle.discountRate),
    returnDiscountRate: String(vehicle.returnDiscountRate),
    displayOrder: String(vehicle.displayOrder),
    carImage: null,
  }
}

export function EditVehicleModal({ isOpen, onClose, vehicle, onVehicleUpdated }: EditVehicleModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditVehicleFormValues>({
    resolver: zodResolver(editVehicleFormSchema),
    defaultValues: vehicle ? toFormValues(vehicle) : undefined,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const editVehicleMutation = useEditVehicle()

  // Read the description as it is typed, for the character counter.
  // When a vehicle is first opened, the form is only filled in by the useEffect
  // below (after the first render), so for that one render this is undefined.
  const watchedDescription = useWatch({ control, name: 'description' })
  let descriptionLength = 0
  if (watchedDescription) {
    descriptionLength = watchedDescription.length
  }

  // Load the vehicle's current values into the form whenever a different vehicle is opened
  useEffect(() => {
    if (vehicle) reset(toFormValues(vehicle))
  }, [vehicle, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Only runs once every field has passed validation
  async function saveVehicle(values: EditVehicleFormValues) {
    if (!vehicle) return

    const vehicleUpdate: VehicleUpdate = {
      name: values.carName,
      description: values.description,
      passengerCapacity: Number(values.passengerCapacity),
      luggageCapacity: Number(values.luggageCapacity),
      handLuggageCapacity: Number(values.handLuggageCapacity),
      discountRate: Number(values.discountRate),
      returnDiscountRate: Number(values.returnDiscountRate),
      displayOrder: Number(values.displayOrder),
      ...(values.carImage ? { image: values.carImage } : {}),
    }

    try {
      const savedVehicle = await editVehicleMutation.mutateAsync({ vehicleId: vehicle.id, vehicle: vehicleUpdate })
      onVehicleUpdated(savedVehicle)
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

  if (!vehicle) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit vehicle"
      description={`Update ${vehicle.name}'s details.`}
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save changes"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset(toFormValues(vehicle))}
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
            <FormField label="Car name" htmlFor="editCarName" error={errors.carName?.message}>
              <TextInput id="editCarName" placeholder="e.g. Saloon, Estate, MPV" {...register('carName')} hasError={!!errors.carName} />
            </FormField>

            <FormField
              label="Description"
              htmlFor="editDescription"
              error={errors.description?.message}
              isOptional
              labelExtra={
                <span className={`text-xs tabular-nums ${descriptionLength > DESCRIPTION_MAX_LENGTH ? 'text-danger' : 'text-muted'}`}>
                  {descriptionLength} / {DESCRIPTION_MAX_LENGTH}
                </span>
              }
            >
              <TextArea
                id="editDescription"
                placeholder="A short description customers see when booking"
                {...register('description')}
                hasError={!!errors.description}
              />
            </FormField>

            <FormField
              label="Display order"
              htmlFor="editDisplayOrder"
              hint="Lower numbers show first in the vehicles list and booking form."
              error={errors.displayOrder?.message}
            >
              <TextInput
                id="editDisplayOrder"
                inputMode="numeric"
                placeholder="1"
                {...register('displayOrder')}
                hasError={!!errors.displayOrder}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Capacity" description="How many passengers and bags this vehicle can carry.">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Passengers" htmlFor="editPassengerCapacity" error={errors.passengerCapacity?.message}>
              <TextInput
                id="editPassengerCapacity"
                inputMode="numeric"
                placeholder="4"
                suffix="seats"
                {...register('passengerCapacity')}
                hasError={!!errors.passengerCapacity}
              />
            </FormField>

            <FormField label="Luggage" htmlFor="editLuggageCapacity" error={errors.luggageCapacity?.message}>
              <TextInput
                id="editLuggageCapacity"
                inputMode="numeric"
                placeholder="2"
                suffix="bags"
                {...register('luggageCapacity')}
                hasError={!!errors.luggageCapacity}
              />
            </FormField>

            <FormField label="Hand luggage" htmlFor="editHandLuggageCapacity" error={errors.handLuggageCapacity?.message}>
              <TextInput
                id="editHandLuggageCapacity"
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
              htmlFor="editDiscountRate"
              hint="Taken off one-way journeys."
              error={errors.discountRate?.message}
            >
              <TextInput
                id="editDiscountRate"
                inputMode="decimal"
                placeholder="0"
                suffix="%"
                {...register('discountRate')}
                hasError={!!errors.discountRate}
              />
            </FormField>

            <FormField
              label="Return discount rate"
              htmlFor="editReturnDiscountRate"
              hint="Taken off return journeys."
              error={errors.returnDiscountRate?.message}
            >
              <TextInput
                id="editReturnDiscountRate"
                inputMode="decimal"
                placeholder="0"
                suffix="%"
                {...register('returnDiscountRate')}
                hasError={!!errors.returnDiscountRate}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Photo" description="Leave blank to keep the current photo.">
          <div className="flex items-center gap-3">
            {vehicle.imageUrl && (
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="h-16 w-24 shrink-0 rounded-lg border border-line bg-surface-muted object-cover"
              />
            )}
            <p className="text-xs text-muted">Current photo</p>
          </div>

          <FormField label="New car image" htmlFor="editCarImage" error={errors.carImage?.message} isOptional className="mt-4">
            {/* Controller connects inputs that aren't a plain text box (here, a file picker) to the form */}
            <Controller
              name="carImage"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  id="editCarImage"
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
