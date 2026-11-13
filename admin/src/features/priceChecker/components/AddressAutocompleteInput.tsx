import { MapPin, Plane, TrainFront } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { endPlacesSession, fetchPlaceSuggestions } from '../../../shared/google/googlePlaces'
import { useDropdownAddresses } from '../../addresses/hooks/useDropdownAddresses'
import type { DropdownAddress } from '../../addresses/types/dropdownAddress'

type AddressAutocompleteInputProps = {
  id: string
  value: string
  placeholder?: string
  hasError?: boolean
  onChange: (newValue: string) => void
  onBlur: () => void
}

const MIN_LETTERS_FOR_GOOGLE = 3
// Wait this long after the last key press before asking Google (saves requests)
const TYPING_DELAY_MS = 250
const MAX_SAVED_ADDRESSES = 5

// Saved airports/stations that match the typed text
function findSavedAddresses(allAddresses: DropdownAddress[], text: string): DropdownAddress[] {
  const lowerText = text.trim().toLowerCase()
  const matches: DropdownAddress[] = []

  for (const address of allAddresses) {
    if (matches.length >= MAX_SAVED_ADDRESSES) {
      break
    }
    if (lowerText === '' || address.address.toLowerCase().includes(lowerText)) {
      matches.push(address)
    }
  }
  return matches
}

// An address text box that suggests saved airports/stations and Google addresses while typing
export function AddressAutocompleteInput({
  id,
  value,
  placeholder,
  hasError = false,
  onChange,
  onBlur,
}: AddressAutocompleteInputProps) {
  const dropdownAddressesQuery = useDropdownAddresses()
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

  let savedAddresses: DropdownAddress[] = []
  if (dropdownAddressesQuery.data) {
    savedAddresses = findSavedAddresses(dropdownAddressesQuery.data, trimmedValue)
  }

  const isGoogleSearchOn = trimmedValue.length >= MIN_LETTERS_FOR_GOOGLE
  const isGoogleLoading = isGoogleSearchOn && googleText !== trimmedValue

  let googleToShow: string[] = []
  if (isGoogleSearchOn && googleText === trimmedValue) {
    googleToShow = googleAddresses
  }

  // The short text shown in the Google group when there are no addresses to list
  let googleMessage = ''
  if (isGoogleLoading) {
    googleMessage = 'Searching Google…'
  } else if (googleProblem !== '') {
    googleMessage = googleProblem
  } else if (googleToShow.length === 0) {
    googleMessage = 'No Google locations found'
  }

  function selectAddress(address: string) {
    onChange(address)
    endPlacesSession()
    setIsOpen(false)
  }

  const hasSuggestions = savedAddresses.length > 0 || isGoogleSearchOn

  return (
    <div className="relative">
      <TextInput
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        hasError={hasError}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          setIsOpen(false)
          onBlur()
        }}
      />

      {isOpen && hasSuggestions && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-72 overflow-y-auto rounded-xl border border-line bg-surface py-2 shadow-lg"
        >
          {savedAddresses.length > 0 && (
            <div>
              <p className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Saved addresses
              </p>
              {savedAddresses.map((address) => {
                let Icon = MapPin
                if (address.type === 'airport') Icon = Plane
                if (address.type === 'station') Icon = TrainFront
                return (
                  <button
                    key={address.id}
                    type="button"
                    role="option"
                    aria-selected={false}
                    // onMouseDown (not onClick) so the choice happens before the input loses focus
                    onMouseDown={(event) => {
                      event.preventDefault()
                      selectAddress(address.address)
                    }}
                    className="flex w-full items-start gap-3 px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>{address.address}</span>
                  </button>
                )
              })}
            </div>
          )}

          {isGoogleSearchOn && (
            <div className={savedAddresses.length > 0 ? 'mt-1 border-t border-line pt-1' : ''}>
              <p className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Google locations
              </p>
              {googleToShow.map((address) => (
                <button
                  key={address}
                  type="button"
                  role="option"
                  aria-selected={false}
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
              {googleMessage !== '' && <p className="px-4 py-2 text-sm text-muted">{googleMessage}</p>}
              {googleToShow.length > 0 && (
                <p className="px-4 pt-1 text-right text-[11px] text-muted">Powered by Google</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
