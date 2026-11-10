import { useEffect, useState } from 'react'
import { endPlacesSession, fetchPlaceSuggestions } from '../../../shared/google/googlePlaces'
import type { DropdownAddress } from '../types/publicApi'
import { useDropdownAddresses } from './usePublicData'

// Which address box the suggestions list belongs to.
// rowIndex is the box's position in the route card (0 = pickup), used to place the list under it.
export type ActiveAddressField = {
  name: string
  rowIndex: number
}

// Google results remember which text they were for, so an old, slow answer is never shown
type PlaceResults = {
  forText: string
  addresses: string[]
}

const MIN_LETTERS_FOR_GOOGLE = 3
// Wait this long after the last key press before asking Google (saves requests)
const TYPING_DELAY_MS = 250
const MAX_SAVED_ADDRESSES = 5

// Saved airports/stations that match the typed text. With nothing typed yet, the first few are shown.
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

// Everything the address suggestion list needs: which box is open, what was typed,
// the matching airports/stations from the admin panel, and Google's suggestions.
export function useAddressAutocomplete() {
  const dropdownAddressesQuery = useDropdownAddresses()
  const [activeField, setActiveField] = useState<ActiveAddressField | null>(null)
  const [text, setText] = useState('')
  const [placeResults, setPlaceResults] = useState<PlaceResults>({ forText: '', addresses: [] })

  const trimmedText = text.trim()
  const isOpen = activeField !== null

  // Ask Google a moment after the customer stops typing
  useEffect(() => {
    if (!isOpen || trimmedText.length < MIN_LETTERS_FOR_GOOGLE) {
      return
    }

    const timer = setTimeout(async () => {
      const addresses = await fetchPlaceSuggestions(trimmedText)
      setPlaceResults({ forText: trimmedText, addresses: addresses })
    }, TYPING_DELAY_MS)

    // Typing again cancels the request that hasn't started yet
    return () => clearTimeout(timer)
  }, [trimmedText, isOpen])

  let savedAddresses: DropdownAddress[] = []
  if (dropdownAddressesQuery.data) {
    savedAddresses = findSavedAddresses(dropdownAddressesQuery.data, trimmedText)
  }

  let googleAddresses: string[] = []
  if (placeResults.forText === trimmedText && trimmedText.length >= MIN_LETTERS_FOR_GOOGLE) {
    googleAddresses = placeResults.addresses
  }

  // The customer clicked into an address box
  function openFor(field: ActiveAddressField, currentText: string): void {
    setActiveField(field)
    setText(currentText)
  }

  // The customer typed in the open box
  function changeText(newText: string): void {
    setText(newText)
  }

  function close(): void {
    setActiveField(null)
  }

  // The customer picked an address: the list closes and Google starts a new session next time
  function finishSelection(): void {
    endPlacesSession()
    setActiveField(null)
  }

  return { activeField, savedAddresses, googleAddresses, openFor, changeText, close, finishSelection }
}
