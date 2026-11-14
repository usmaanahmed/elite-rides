import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useAddEvent, useEditEvent } from '../hooks/useEvents'
import { eventFormSchema, DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '../schemas/eventFormSchema'
import type { EventItem, EventFormValues, NewEvent } from '../types/event'
import { EventImagesInput } from './EventImagesInput'

type EventModalProps = {
  isOpen: boolean
  onClose: () => void
  // The event being edited. null means the modal adds a new one.
  eventToEdit: EventItem | null
  // Called with the saved event after it has been added or updated
  onSaved: (event: EventItem, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'event-form'

const emptyFormValues: EventFormValues = {
  name: '',
  description: '',
  existingImages: [],
  newImages: [],
}

// One modal for both adding a new event and editing an existing one
export function EventModal({ isOpen, onClose, eventToEdit, onSaved }: EventModalProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddEvent()
  const editMutation = useEditEvent()

  const isEditing = eventToEdit !== null

  // Read the description as it is typed, for the character counter
  const watchedDescription = useWatch({ control, name: 'description' })
  let descriptionLength = 0
  if (watchedDescription) {
    descriptionLength = watchedDescription.length
  }

  // Every time the modal opens, fill the form with the event being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (eventToEdit) {
      reset({
        name: eventToEdit.name,
        description: eventToEdit.description,
        existingImages: eventToEdit.images,
        newImages: [],
      })
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, eventToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Works out which saved images the admin removed (they were saved before but are not in the form any more)
  function getRemovedImageNames(values: EventFormValues): string[] {
    const removedNames: string[] = []
    if (!eventToEdit) return removedNames

    for (const savedImage of eventToEdit.images) {
      const isStillKept = values.existingImages.some((image) => image.fileName === savedImage.fileName)
      if (!isStillKept) {
        removedNames.push(savedImage.fileName)
      }
    }
    return removedNames
  }

  // Only runs once every field has passed validation (the schema has already trimmed the text)
  async function saveEvent(values: EventFormValues) {
    const eventData: NewEvent = {
      name: values.name,
      description: values.description,
      newImages: values.newImages,
      removedImages: getRemovedImageNames(values),
    }

    try {
      let savedEvent: EventItem
      if (eventToEdit) {
        savedEvent = await editMutation.mutateAsync({ eventId: eventToEdit.id, event: eventData })
      } else {
        savedEvent = await addMutation.mutateAsync(eventData)
      }
      onSaved(savedEvent, isEditing)
      onClose()
    } catch (error) {
      let message = 'The event could not be saved. Please try again.'
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
      title={isEditing ? 'Edit event' : 'Add event'}
      description="Event name, description and photos."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save event"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveEvent)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField label="Event name" htmlFor="eventName" error={errors.name?.message}>
          <TextInput
            id="eventName"
            placeholder="e.g. Wimbledon Championships"
            autoComplete="off"
            maxLength={NAME_MAX_LENGTH}
            {...register('name')}
            hasError={!!errors.name}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="eventDescription"
          error={errors.description?.message}
          isOptional
          labelExtra={
            <span className={`text-xs tabular-nums ${descriptionLength > DESCRIPTION_MAX_LENGTH ? 'text-danger' : 'text-muted'}`}>
              {descriptionLength} / {DESCRIPTION_MAX_LENGTH}
            </span>
          }
        >
          <TextArea
            id="eventDescription"
            placeholder="e.g. Dates, venue, pickup and drop-off details"
            {...register('description')}
            hasError={!!errors.description}
          />
        </FormField>

        <FormField label="Images" htmlFor="eventImages" error={errors.newImages?.message} isOptional>
          {/* Controller connects inputs that aren't a plain text box to the form */}
          <Controller
            name="newImages"
            control={control}
            render={({ field: newImagesField }) => (
              <Controller
                name="existingImages"
                control={control}
                render={({ field: existingImagesField }) => (
                  <EventImagesInput
                    id="eventImages"
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
