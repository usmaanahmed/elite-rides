import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useVehicles } from '../../vehicles/hooks/useVehicles'
import type { Vehicle } from '../../vehicles/types/vehicle'
import { useAddTour, useEditTour } from '../hooks/useTours'
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH, tourFormSchema } from '../schemas/tourFormSchema'
import type {
  NewTour,
  TourFormValues,
  TourItem,
  TourItineraryDay,
  TourItineraryDayFormValue,
  TourPlace,
  TourPlaceFormValue,
  TourPrice,
  TourPriceFormValue,
} from '../types/tour'
import { TourImagesInput } from './TourImagesInput'
import { TourItineraryInput } from './TourItineraryInput'
import { TourPricesInput } from './TourPricesInput'

type TourModalProps = {
  isOpen: boolean
  onClose: () => void
  // The tour being edited. null means the modal adds a new one.
  tourToEdit: TourItem | null
  // Called with the saved tour after it has been added or updated
  onSaved: (tour: TourItem, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'tour-form'

// Form values of a brand new tour
const emptyFormValues: TourFormValues = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  durationDays: '1',
  itinerary: [],
  prices: [],
  existingImages: [],
  newImages: [],
}

// One price row for every vehicle. A saved tour fills in the prices it already has, the rest stay empty.
function buildPriceRows(vehicles: Vehicle[], savedPrices: TourPrice[]): TourPriceFormValue[] {
  const rows: TourPriceFormValue[] = []
  for (const vehicle of vehicles) {
    const savedPrice = savedPrices.find((item) => item.vehicleId === vehicle.id)
    let priceText = ''
    if (savedPrice) {
      priceText = String(savedPrice.price)
    }
    rows.push({ vehicleId: vehicle.id, vehicleName: vehicle.name, price: priceText })
  }
  return rows
}

// Turns the price rows of the form into the list the server wants (only the vehicles that have a price)
function buildPricesToSave(rows: TourPriceFormValue[]): TourPrice[] {
  const prices: TourPrice[] = []
  for (const row of rows) {
    if (row.price !== '') {
      prices.push({ vehicleId: row.vehicleId, price: Number(row.price) })
    }
  }
  return prices
}

// Puts a saved itinerary into the form. A place saved without a map position (lat and lng both 0)
// gets null, so the admin is asked to pick it again from the Google list.
function buildItineraryFormValues(days: TourItineraryDay[]): TourItineraryDayFormValue[] {
  const formDays: TourItineraryDayFormValue[] = []
  for (const day of days) {
    const formPlaces: TourPlaceFormValue[] = []
    for (const place of day.places) {
      const hasLocation = place.lat !== 0 || place.lng !== 0
      formPlaces.push({
        name: place.name,
        address: place.address,
        lat: hasLocation ? place.lat : null,
        lng: hasLocation ? place.lng : null,
        description: place.description,
      })
    }
    formDays.push({ title: day.title, places: formPlaces })
  }
  return formDays
}

// Turns the itinerary of the form into what the server wants (the schema has already made sure every place has lat / lng)
function buildItineraryToSave(formDays: TourItineraryDayFormValue[]): TourItineraryDay[] {
  const days: TourItineraryDay[] = []
  for (const formDay of formDays) {
    const places: TourPlace[] = []
    for (const formPlace of formDay.places) {
      places.push({
        name: formPlace.name,
        address: formPlace.address,
        lat: Number(formPlace.lat),
        lng: Number(formPlace.lng),
        description: formPlace.description,
      })
    }
    days.push({ title: formDay.title, places: places })
  }
  return days
}

// One modal for both adding a new tour and editing an existing one
export function TourModal({ isOpen, onClose, tourToEdit, onSaved }: TourModalProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddTour()
  const editMutation = useEditTour()
  const vehiclesQuery = useVehicles()
  const vehicles = vehiclesQuery.data

  const isEditing = tourToEdit !== null

  // Read the description and the price rows as they are typed
  const watchedDescription = useWatch({ control, name: 'description' })
  const priceRows = useWatch({ control, name: 'prices' })
  let descriptionLength = 0
  if (watchedDescription) {
    descriptionLength = watchedDescription.length
  }

  // Every time the modal opens, fill the form with the tour being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen || !vehicles) return

    if (tourToEdit) {
      reset({
        title: tourToEdit.title,
        description: tourToEdit.description,
        startDate: tourToEdit.startDate,
        endDate: tourToEdit.endDate,
        durationDays: String(tourToEdit.durationDays),
        itinerary: buildItineraryFormValues(tourToEdit.itinerary),
        prices: buildPriceRows(vehicles, tourToEdit.prices),
        existingImages: tourToEdit.images,
        newImages: [],
      })
    } else {
      reset({ ...emptyFormValues, prices: buildPriceRows(vehicles, []) })
    }
  }, [isOpen, tourToEdit, vehicles, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Works out which saved images the admin removed (they were saved before but are not in the form any more)
  function getRemovedImageNames(values: TourFormValues): string[] {
    const removedNames: string[] = []
    if (!tourToEdit) return removedNames

    for (const savedImage of tourToEdit.images) {
      const isStillKept = values.existingImages.some((image) => image.fileName === savedImage.fileName)
      if (!isStillKept) {
        removedNames.push(savedImage.fileName)
      }
    }
    return removedNames
  }

  // Only runs once every field has passed validation (the schema has already trimmed the text)
  async function saveTour(values: TourFormValues) {
    const tourData: NewTour = {
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      durationDays: Number(values.durationDays),
      itinerary: buildItineraryToSave(values.itinerary),
      prices: buildPricesToSave(values.prices),
      newImages: values.newImages,
      removedImages: getRemovedImageNames(values),
    }

    try {
      let savedTour: TourItem
      if (tourToEdit) {
        savedTour = await editMutation.mutateAsync({ tourId: tourToEdit.id, tour: tourData })
      } else {
        savedTour = await addMutation.mutateAsync(tourData)
      }
      onSaved(savedTour, isEditing)
      onClose()
    } catch (error) {
      let message = 'The tour could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message })
    }
  }

  // Works out what the "Price per vehicle" part of the form should show
  function renderPrices() {
    if (vehiclesQuery.isPending) {
      return <div className="h-24 animate-pulse rounded-xl bg-surface-muted" />
    }
    if (vehiclesQuery.isError) {
      return <Alert variant="error" title="Vehicles could not be loaded" description={vehiclesQuery.error.message} />
    }
    if (vehiclesQuery.data.length === 0) {
      return <Alert variant="error" title="Add a vehicle first" description="Tour prices are set per vehicle." />
    }
    return <TourPricesInput rows={priceRows ?? []} register={register} errors={errors} />
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit tour' : 'Add tour'}
      description="Tour title, photos and the price for each vehicle."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save tour"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveTour)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField label="Tour title" htmlFor="tourTitle" error={errors.title?.message}>
          <TextInput
            id="tourTitle"
            placeholder="e.g. Windsor Castle & Stonehenge day tour"
            autoComplete="off"
            maxLength={TITLE_MAX_LENGTH}
            {...register('title')}
            hasError={!!errors.title}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="tourDescription"
          error={errors.description?.message}
          isOptional
          labelExtra={
            <span className={`text-xs tabular-nums ${descriptionLength > DESCRIPTION_MAX_LENGTH ? 'text-danger' : 'text-muted'}`}>
              {descriptionLength} / {DESCRIPTION_MAX_LENGTH}
            </span>
          }
        >
          <TextArea
            id="tourDescription"
            placeholder="e.g. What the tour includes, places visited, how long it takes"
            {...register('description')}
            hasError={!!errors.description}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Start date" htmlFor="tourStartDate" error={errors.startDate?.message} isOptional>
            <TextInput id="tourStartDate" type="date" {...register('startDate')} hasError={!!errors.startDate} />
          </FormField>
          <FormField label="End date" htmlFor="tourEndDate" error={errors.endDate?.message} isOptional>
            <TextInput id="tourEndDate" type="date" {...register('endDate')} hasError={!!errors.endDate} />
          </FormField>
          <FormField label="Duration" htmlFor="tourDuration" error={errors.durationDays?.message}>
            <TextInput
              id="tourDuration"
              inputMode="numeric"
              suffix="days"
              autoComplete="off"
              {...register('durationDays')}
              hasError={!!errors.durationDays}
            />
          </FormField>
        </div>

        <FormField label="Itinerary" htmlFor="tourItinerary" isOptional>
          <div id="tourItinerary">
            <TourItineraryInput control={control} register={register} setValue={setValue} errors={errors} />
            <p className="mt-2 text-xs text-muted">
              Search each place on Google Maps. The first place of Day 1 is the start, the last place of the last day is the end.
            </p>
          </div>
        </FormField>

        <FormField label="Image gallery" htmlFor="tourImages" error={errors.newImages?.message} isOptional>
          {/* Controller connects inputs that aren't a plain text box to the form */}
          <Controller
            name="newImages"
            control={control}
            render={({ field: newImagesField }) => (
              <Controller
                name="existingImages"
                control={control}
                render={({ field: existingImagesField }) => (
                  <TourImagesInput
                    id="tourImages"
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

        <FormField
          label="Price per vehicle"
          htmlFor="tourPrices"
          error={typeof errors.prices?.message === 'string' ? errors.prices.message : undefined}
        >
          <div id="tourPrices">{renderPrices()}</div>
          <p className="mt-2 text-xs text-muted">Leave a vehicle empty if it is not offered for this tour.</p>
        </FormField>
      </form>
    </Modal>
  )
}
