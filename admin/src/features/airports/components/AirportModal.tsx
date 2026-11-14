import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useAddAirport, useEditAirport } from '../hooks/useAirports'
import { airportFormSchema, DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '../schemas/airportFormSchema'
import type { Airport, AirportFormValues, NewAirport } from '../types/airport'
import { AirportAddressInput } from './AirportAddressInput'
import { AirportImagesInput } from './AirportImagesInput'

type AirportModalProps = {
  isOpen: boolean
  onClose: () => void
  // The airport being edited. null means the modal adds a new one.
  airportToEdit: Airport | null
  // Called with the saved airport after it has been added or updated
  onSaved: (airport: Airport, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'airport-form'

const emptyFormValues: AirportFormValues = {
  name: '',
  description: '',
  address: '',
  existingImages: [],
  newImages: [],
}

// One modal for both adding a new airport and editing an existing one
export function AirportModal({ isOpen, onClose, airportToEdit, onSaved }: AirportModalProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AirportFormValues>({
    resolver: zodResolver(airportFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddAirport()
  const editMutation = useEditAirport()

  const isEditing = airportToEdit !== null

  // Read the description as it is typed, for the character counter
  const watchedDescription = useWatch({ control, name: 'description' })
  let descriptionLength = 0
  if (watchedDescription) {
    descriptionLength = watchedDescription.length
  }

  // Every time the modal opens, fill the form with the airport being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (airportToEdit) {
      reset({
        name: airportToEdit.name,
        description: airportToEdit.description,
        address: airportToEdit.address,
        existingImages: airportToEdit.images,
        newImages: [],
      })
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, airportToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Works out which saved images the admin removed (they were saved before but are not in the form any more)
  function getRemovedImageNames(values: AirportFormValues): string[] {
    const removedNames: string[] = []
    if (!airportToEdit) return removedNames

    for (const savedImage of airportToEdit.images) {
      const isStillKept = values.existingImages.some((image) => image.fileName === savedImage.fileName)
      if (!isStillKept) {
        removedNames.push(savedImage.fileName)
      }
    }
    return removedNames
  }

  // Only runs once every field has passed validation (the schema has already trimmed the text)
  async function saveAirport(values: AirportFormValues) {
    const airportData: NewAirport = {
      name: values.name,
      description: values.description,
      address: values.address,
      newImages: values.newImages,
      removedImages: getRemovedImageNames(values),
    }

    try {
      let savedAirport: Airport
      if (airportToEdit) {
        savedAirport = await editMutation.mutateAsync({ airportId: airportToEdit.id, airport: airportData })
      } else {
        savedAirport = await addMutation.mutateAsync(airportData)
      }
      onSaved(savedAirport, isEditing)
      onClose()
    } catch (error) {
      let message = 'The airport could not be saved. Please try again.'
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
      title={isEditing ? 'Edit airport' : 'Add airport'}
      description="Airport details, photos and its location on Google Maps."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save airport"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveAirport)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField label="Airport name" htmlFor="airportName" error={errors.name?.message}>
          <TextInput
            id="airportName"
            placeholder="e.g. London Heathrow Airport"
            autoComplete="off"
            maxLength={NAME_MAX_LENGTH}
            {...register('name')}
            hasError={!!errors.name}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="airportDescription"
          error={errors.description?.message}
          isOptional
          labelExtra={
            <span className={`text-xs tabular-nums ${descriptionLength > DESCRIPTION_MAX_LENGTH ? 'text-danger' : 'text-muted'}`}>
              {descriptionLength} / {DESCRIPTION_MAX_LENGTH}
            </span>
          }
        >
          <TextArea
            id="airportDescription"
            placeholder="e.g. Terminals, pickup points, parking details"
            {...register('description')}
            hasError={!!errors.description}
          />
        </FormField>

        <FormField label="Address (Google Map)" htmlFor="airportAddress" error={errors.address?.message}>
          {/* Controller connects inputs that aren't a plain text box to the form */}
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <AirportAddressInput
                id="airportAddress"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                hasError={!!errors.address}
              />
            )}
          />
        </FormField>

        <FormField label="Images" htmlFor="airportImages" error={errors.newImages?.message} isOptional>
          <Controller
            name="newImages"
            control={control}
            render={({ field: newImagesField }) => (
              <Controller
                name="existingImages"
                control={control}
                render={({ field: existingImagesField }) => (
                  <AirportImagesInput
                    id="airportImages"
                    existingImages={existingImagesField.value}
                    newImages={newImagesField.value}
                    onExistingImagesChange={existingImagesField.onChange}
                    onNewImagesChange={newImagesField.onChange}
                    hasError={!!errors.newImages}
                  />
                )}
              />
            )}
          />
        </FormField>
      </form>
    </Modal>
  )
}
