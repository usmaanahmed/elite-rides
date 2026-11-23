import { CircleCheck, LoaderCircle, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { endPlacesSession, fetchPlaceSuggestions, getPickedPlace, type PickedPlace } from '../../../shared/google/googlePlaces'

type TourPlaceSearchInputProps = {
  id: string
  // The text in the box (the place name)
  value: string
  // Full Google address of the picked place ("" if nothing is picked yet)
  address: string
  // true once the place has been picked from the Google list
  isPicked: boolean
  hasError?: boolean
  // The admin typed something (the old pick no longer counts)
  onTextChange: (newText: string) => void
  // The admin picked a place from the Google list
  onPick: (place: PickedPlace) => void
  onBlur: () => void
}

const MIN_LETTERS_FOR_GOOGLE = 3
// Wait this long after the last key press before asking Google (saves requests)
const TYPING_DELAY_MS = 250

// A text box that searches places on Google Maps. Picking one fills in its name, address and map position.
export function TourPlaceSearchInput({
  id,
  value,
  address,
  isPicked,
  hasError = false,
  onTextChange,
  onPick,
  onBlur,
}: TourPlaceSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [googleAddresses, setGoogleAddresses] = useState<string[]>([])
  // The text the Google list was fetched for, so an old slow answer is never shown
  const [googleText, setGoogleText] = useState('')
  const [googleProblem, setGoogleProblem] = useState('')
  // true while we ask Google for the map position of the picked place
  const [isLoadingPlace, setIsLoadingPlace] = useState(false)
  // Shown when Google can't give the map position of the picked place
  const [pickProblem, setPickProblem] = useState('')

  const trimmedValue = value.trim()

  // Ask Google a moment after the admin stops typing
  useEffect(() => {
    if (!isOpen || trimmedValue.length < MIN_LETTERS_FOR_GOOGLE) {
      return
    }

    const timer = setTimeout(async () => {
      const result = await fetchPlaceSuggestions(trimmedValue)
      setGoogleAddresses(result.addresses)
      setGoogleProblem(result.problem)
      setGoogleText(trimmedValue)
    }, TYPING_DELAY_MS)

    return () => clearTimeout(timer)
  }, [trimmedValue, isOpen])

  const isGoogleSearchOn = trimmedValue.length >= MIN_LETTERS_FOR_GOOGLE
  const isGoogleLoading = isGoogleSearchOn && googleText !== trimmedValue

  let addressesToShow: string[] = []
  if (isGoogleSearchOn && googleText === trimmedValue) {
    addressesToShow = googleAddresses
  }

  // The short text shown when there are no addresses to list
  let message = ''
  if (isGoogleLoading) {
    message = 'Searching Google…'
  } else if (googleProblem !== '') {
    message = googleProblem
  } else if (addressesToShow.length === 0) {
    message = 'No Google locations found'
  }

  async function selectSuggestion(suggestionText: string) {
    setIsOpen(false)
    setPickProblem('')
    setIsLoadingPlace(true)
    // Show the picked text straight away, the map position comes a moment later
    onTextChange(suggestionText)

    const place = await getPickedPlace(suggestionText)
    endPlacesSession()
    setIsLoadingPlace(false)

    if (place) {
      onPick(place)
    } else {
      setPickProblem('Google could not find where this place is. Please pick another one.')
    }
  }

  return (
    <div className="relative">
      <TextInput
        id={id}
        value={value}
        placeholder="Search a place on Google Maps, e.g. Stonehenge"
        autoComplete="off"
        maxLength={200}
        hasError={hasError}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setPickProblem('')
          onTextChange(event.target.value)
        }}
        onBlur={() => {
          setIsOpen(false)
          onBlur()
        }}
      />

      {/* Under the box: the full address once the place is picked */}
      {isLoadingPlace && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <LoaderCircle className="size-3.5 animate-spin" strokeWidth={2} />
          Getting the location…
        </p>
      )}
      {pickProblem !== '' && <p className="mt-1 text-xs font-medium text-danger">{pickProblem}</p>}
      {!isLoadingPlace && isPicked && address !== '' && (
        <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
          <CircleCheck className="mt-px size-3.5 shrink-0 text-emerald-600" strokeWidth={2} />
          <span>{address}</span>
        </p>
      )}

      {isOpen && isGoogleSearchOn && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-72 overflow-y-auto rounded-xl border border-line bg-surface py-2 shadow-lg"
        >
          {addressesToShow.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              role="option"
              aria-selected={false}
              // onMouseDown (not onClick) so the choice happens before the input loses focus
              onMouseDown={(event) => {
                event.preventDefault()
                selectSuggestion(suggestion)
              }}
              className="flex w-full items-start gap-3 px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={2} />
              <span>{suggestion}</span>
            </button>
          ))}
          {message !== '' && <p className="px-4 py-2 text-sm text-muted">{message}</p>}
          {addressesToShow.length > 0 && <p className="px-4 pt-1 text-right text-[11px] text-muted">Powered by Google</p>}
        </div>
      )}
    </div>
  )
}
