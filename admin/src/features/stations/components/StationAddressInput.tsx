import { MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { endPlacesSession, fetchPlaceSuggestions } from '../../../shared/google/googlePlaces'
import { ADDRESS_MAX_LENGTH } from '../schemas/stationFormSchema'

type StationAddressInputProps = {
  id: string
  value: string
  hasError?: boolean
  onChange: (newValue: string) => void
  onBlur: () => void
}

const MIN_LETTERS_FOR_GOOGLE = 3
// Wait this long after the last key press before asking Google (saves requests)
const TYPING_DELAY_MS = 250

// An address text box that suggests Google locations while typing
export function StationAddressInput({ id, value, hasError = false, onChange, onBlur }: StationAddressInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [googleAddresses, setGoogleAddresses] = useState<string[]>([])
  // The text the Google list was fetched for, so an old slow answer is never shown
  const [googleText, setGoogleText] = useState('')
  const [googleProblem, setGoogleProblem] = useState('')

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

  function selectAddress(address: string) {
    onChange(address)
    endPlacesSession()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <TextInput
        id={id}
        value={value}
        placeholder="Search the station on Google Maps"
        autoComplete="off"
        maxLength={ADDRESS_MAX_LENGTH}
        hasError={hasError}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          setIsOpen(false)
          onBlur()
        }}
      />

      {isOpen && isGoogleSearchOn && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-72 overflow-y-auto rounded-xl border border-line bg-surface py-2 shadow-lg"
        >
          {addressesToShow.map((address) => (
            <button
              key={address}
              type="button"
              role="option"
              aria-selected={false}
              // onMouseDown (not onClick) so the choice happens before the input loses focus
              onMouseDown={(event) => {
                event.preventDefault()
                selectAddress(address)
              }}
              className="flex w-full items-start gap-3 px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={2} />
              <span>{address}</span>
            </button>
          ))}
          {message !== '' && <p className="px-4 py-2 text-sm text-muted">{message}</p>}
          {addressesToShow.length > 0 && <p className="px-4 pt-1 text-right text-[11px] text-muted">Powered by Google</p>}
        </div>
      )}
    </div>
  )
}
