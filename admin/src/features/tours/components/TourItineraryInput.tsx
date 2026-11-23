import { Plus, Trash2 } from 'lucide-react'
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form'
import { Button } from '../../../shared/components/buttons/Button'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { PickedPlace } from '../../../shared/google/googlePlaces'
import type { TourFormValues, TourPlaceFormValue } from '../types/tour'
import { TourPlaceSearchInput } from './TourPlaceSearchInput'

// The form helpers every part of the itinerary needs
type FormProps = {
  control: Control<TourFormValues>
  register: UseFormRegister<TourFormValues>
  setValue: UseFormSetValue<TourFormValues>
  errors: FieldErrors<TourFormValues>
}

// A new, empty place row
const emptyPlace: TourPlaceFormValue = { name: '', address: '', lat: null, lng: null, description: '' }

type PlaceRowProps = FormProps & {
  dayIndex: number
  placeIndex: number
  onRemove: () => void
}

// One place of a day: a Google search box for the place and a short optional note
function PlaceRow({ dayIndex, placeIndex, control, register, setValue, errors, onRemove }: PlaceRowProps) {
  const placePath = `itinerary.${dayIndex}.places.${placeIndex}` as const
  const place = useWatch({ control, name: placePath })
  const placeErrors = errors.itinerary?.[dayIndex]?.places?.[placeIndex]

  let isPicked = false
  let address = ''
  if (place) {
    isPicked = place.lat !== null && place.lng !== null
    address = place.address
  }

  // Typing makes the old Google pick invalid, so its address and map position are cleared
  function clearPickedLocation() {
    setValue(`${placePath}.address`, '')
    setValue(`${placePath}.lat`, null)
    setValue(`${placePath}.lng`, null)
  }

  // Saves the address and map position Google gave us
  function savePickedLocation(pickedPlace: PickedPlace) {
    setValue(`${placePath}.address`, pickedPlace.address)
    setValue(`${placePath}.lat`, pickedPlace.lat)
    setValue(`${placePath}.lng`, pickedPlace.lng)
  }

  return (
    <div className="flex items-start gap-2">
      <span className="mt-3 grid size-6 shrink-0 place-items-center rounded-full bg-surface-muted text-xs font-semibold text-muted">
        {placeIndex + 1}
      </span>
      <div className="grid flex-1 gap-2 sm:grid-cols-[3fr_2fr]">
        <div>
          <Controller
            name={`${placePath}.name`}
            control={control}
            render={({ field }) => (
              <TourPlaceSearchInput
                id={`tourPlace-${dayIndex}-${placeIndex}`}
                value={field.value}
                address={address}
                isPicked={isPicked}
                hasError={!!placeErrors?.name}
                onTextChange={(newText) => {
                  clearPickedLocation()
                  field.onChange(newText)
                }}
                onPick={(pickedPlace) => {
                  // Save the location first, so the name check below already sees it
                  savePickedLocation(pickedPlace)
                  field.onChange(pickedPlace.name)
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {placeErrors?.name && <p className="mt-1 text-xs font-medium text-danger">{placeErrors.name.message}</p>}
        </div>
        <div>
          <TextInput
            placeholder="Short note (optional)"
            autoComplete="off"
            maxLength={500}
            {...register(`${placePath}.description`)}
            hasError={!!placeErrors?.description}
          />
          {placeErrors?.description && (
            <p className="mt-1 text-xs font-medium text-danger">{placeErrors.description.message}</p>
          )}
        </div>
      </div>
      <IconButton icon={Trash2} label={`Remove place ${placeIndex + 1}`} onClick={onRemove} />
    </div>
  )
}

type DayPlacesProps = FormProps & {
  dayIndex: number
}

// The places of one day. The admin can add as many places as needed.
function DayPlaces({ dayIndex, control, register, setValue, errors }: DayPlacesProps) {
  const { fields, append, remove } = useFieldArray({ control, name: `itinerary.${dayIndex}.places` })
  const placesError = errors.itinerary?.[dayIndex]?.places?.message

  return (
    <div className="space-y-3">
      {fields.map((field, placeIndex) => (
        <PlaceRow
          key={field.id}
          dayIndex={dayIndex}
          placeIndex={placeIndex}
          control={control}
          register={register}
          setValue={setValue}
          errors={errors}
          onRemove={() => remove(placeIndex)}
        />
      ))}

      {placesError && <p className="text-xs font-medium text-danger">{placesError}</p>}

      <Button variant="ghost" icon={Plus} onClick={() => append({ ...emptyPlace })}>
        Add place
      </Button>
    </div>
  )
}

// The itinerary of a tour: a list of days, and each day has a list of places picked from Google Maps.
// The first place of Day 1 is where the tour starts, the last place of the last day is where it ends.
export function TourItineraryInput({ control, register, setValue, errors }: FormProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'itinerary' })

  return (
    <div className="space-y-4">
      {fields.map((field, dayIndex) => {
        const dayTitleError = errors.itinerary?.[dayIndex]?.title?.message
        return (
          <div key={field.id} className="space-y-3 rounded-xl border border-line p-4">
            <div className="flex items-start gap-2">
              <span className="pt-3 text-sm font-semibold text-ink">Day {dayIndex + 1}</span>
              <div className="flex-1">
                <TextInput
                  placeholder="Day title (optional), e.g. Windsor & Stonehenge"
                  autoComplete="off"
                  maxLength={100}
                  {...register(`itinerary.${dayIndex}.title`)}
                  hasError={!!dayTitleError}
                />
                {dayTitleError && <p className="mt-1 text-xs font-medium text-danger">{dayTitleError}</p>}
              </div>
              <IconButton icon={Trash2} label={`Remove day ${dayIndex + 1}`} onClick={() => remove(dayIndex)} />
            </div>

            <DayPlaces dayIndex={dayIndex} control={control} register={register} setValue={setValue} errors={errors} />
          </div>
        )
      })}

      <Button variant="secondary" icon={Plus} onClick={() => append({ title: '', places: [{ ...emptyPlace }] })}>
        Add day
      </Button>
    </div>
  )
}
