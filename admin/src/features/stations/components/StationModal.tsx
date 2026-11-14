import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useAddStation, useEditStation } from '../hooks/useStations'
import { stationFormSchema, DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '../schemas/stationFormSchema'
import type { Station, StationFormValues, NewStation } from '../types/station'
import { StationAddressInput } from './StationAddressInput'
import { StationImagesInput } from './StationImagesInput'

type StationModalProps = {
  isOpen: boolean
  onClose: () => void
  // The station being edited. null means the modal adds a new one.
  stationToEdit: Station | null
  // Called with the saved station after it has been added or updated
  onSaved: (station: Station, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'station-form'

const emptyFormValues: StationFormValues = {
  name: '',
  description: '',
  address: '',
  existingImages: [],
  newImages: [],
}

// One modal for both adding a new station and editing an existing one
export function StationModal({ isOpen, onClose, stationToEdit, onSaved }: StationModalProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StationFormValues>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddStation()
  const editMutation = useEditStation()

  const isEditing = stationToEdit !== null

  // Read the description as it is typed, for the character counter
  const watchedDescription = useWatch({ control, name: 'description' })
  let descriptionLength = 0
  if (watchedDescription) {
    descriptionLength = watchedDescription.length
  }

  // Every time the modal opens, fill the form with the station being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (stationToEdit) {
      reset({
        name: stationToEdit.name,
        description: stationToEdit.description,
        address: stationToEdit.address,
        existingImages: stationToEdit.images,
        newImages: [],
      })
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, stationToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Works out which saved images the admin removed (they were saved before but are not in the form any more)
  function getRemovedImageNames(values: StationFormValues): string[] {
    const removedNames: string[] = []
    if (!stationToEdit) return removedNames

    for (const savedImage of stationToEdit.images) {
      const isStillKept = values.existingImages.some((image) => image.fileName === savedImage.fileName)
      if (!isStillKept) {
        removedNames.push(savedImage.fileName)
      }
    }
    return removedNames
  }

  // Only runs once every field has passed validation (the schema has already trimmed the text)
  async function saveStation(values: StationFormValues) {
    const stationData: NewStation = {
      name: values.name,
      description: values.description,
      address: values.address,
      newImages: values.newImages,
      removedImages: getRemovedImageNames(values),
    }

    try {
      let savedStation: Station
      if (stationToEdit) {
        savedStation = await editMutation.mutateAsync({ stationId: stationToEdit.id, station: stationData })
      } else {
        savedStation = await addMutation.mutateAsync(stationData)
      }
      onSaved(savedStation, isEditing)
      onClose()
    } catch (error) {
      let message = 'The station could not be saved. Please try again.'
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
      title={isEditing ? 'Edit station' : 'Add station'}
      description="Station details, photos and its location on Google Maps."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save station"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveStation)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField label="Station name" htmlFor="stationName" error={errors.name?.message}>
          <TextInput
            id="stationName"
            placeholder="e.g. London Paddington Station"
            autoComplete="off"
            maxLength={NAME_MAX_LENGTH}
            {...register('name')}
            hasError={!!errors.name}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="stationDescription"
          error={errors.description?.message}
          isOptional
          labelExtra={
            <span className={`text-xs tabular-nums ${descriptionLength > DESCRIPTION_MAX_LENGTH ? 'text-danger' : 'text-muted'}`}>
              {descriptionLength} / {DESCRIPTION_MAX_LENGTH}
            </span>
          }
        >
          <TextArea
            id="stationDescription"
            placeholder="e.g. Platforms, pickup points, parking details"
            {...register('description')}
            hasError={!!errors.description}
          />
        </FormField>

        <FormField label="Address (Google Map)" htmlFor="stationAddress" error={errors.address?.message}>
          {/* Controller connects inputs that aren't a plain text box to the form */}
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <StationAddressInput
                id="stationAddress"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                hasError={!!errors.address}
              />
            )}
          />
        </FormField>

        <FormField label="Images" htmlFor="stationImages" error={errors.newImages?.message} isOptional>
          <Controller
            name="newImages"
            control={control}
            render={({ field: newImagesField }) => (
              <Controller
                name="existingImages"
                control={control}
                render={({ field: existingImagesField }) => (
                  <StationImagesInput
                    id="stationImages"
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
