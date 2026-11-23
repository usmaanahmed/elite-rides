// Google address suggestions ("Places API (New)"), loaded with a plain <script> tag (no npm package).
// If the key is missing or Google fails, a reason is returned and the admin can still type.

const API_KEY: string = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()
const CALLBACK_NAME = 'eliteRidesGoogleMapsReady'

// The small part of Google's library we use (written by hand, so no extra types package is needed)
type PlaceDetails = {
  fetchFields: (request: { fields: string[] }) => Promise<unknown>
  displayName?: string | null
  formattedAddress?: string | null
  location?: { lat: () => number; lng: () => number } | null
}

type PlacePrediction = {
  text: { toString: () => string }
  toPlace: () => PlaceDetails
}

type SuggestionsResult = {
  suggestions: { placePrediction: PlacePrediction | null }[]
}

type PlacesLibrary = {
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions: (request: {
      input: string
      sessionToken: object
      includedRegionCodes: string[]
    }) => Promise<SuggestionsResult>
  }
  AutocompleteSessionToken: new () => object
}

type GoogleGlobal = {
  maps: { importLibrary: (name: string) => Promise<unknown> }
}

// Loading starts once and is shared by every address field
let loadingPromise: Promise<boolean> | null = null
// Google bills one "session" from the first letter typed until an address is chosen
let sessionToken: object | null = null
// Remembers Google's prediction for each suggested text, so we can ask for its map position when it is picked
const predictionByText = new Map<string, PlacePrediction>()

function getGoogle(): GoogleGlobal | undefined {
  return (window as unknown as { google?: GoogleGlobal }).google
}

// Adds Google's script to the page. Resolves true when ready, false if it can't load.
function loadGoogleMaps(): Promise<boolean> {
  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = new Promise((resolve) => {
    if (API_KEY === '') {
      resolve(false)
      return
    }
    if (getGoogle()) {
      resolve(true)
      return
    }

    // Google calls this function when the script is ready
    ;(window as unknown as Record<string, unknown>)[CALLBACK_NAME] = () => resolve(true)

    const params = new URLSearchParams({
      key: API_KEY,
      v: 'weekly',
      loading: 'async',
      libraries: 'places',
      callback: CALLBACK_NAME,
    })
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`
    script.async = true
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })

  return loadingPromise
}

// Google's suggested UK addresses for what the admin has typed, e.g. "heath" -> "Heathrow Airport, …"
export type PlaceSuggestionsResult = {
  addresses: string[]
  // Empty when everything worked, otherwise a short reason to show the admin
  problem: string
}

export async function fetchPlaceSuggestions(text: string): Promise<PlaceSuggestionsResult> {
  try {
    const isReady = await loadGoogleMaps()
    const google = getGoogle()
    if (!isReady || !google) {
      return { addresses: [], problem: 'Google Maps could not be loaded. Check the API key and its allowed websites.' }
    }

    const places = (await google.maps.importLibrary('places')) as PlacesLibrary
    if (!sessionToken) {
      sessionToken = new places.AutocompleteSessionToken()
    }

    const result = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: text,
      sessionToken: sessionToken,
      includedRegionCodes: ['gb'],
    })

    const addresses: string[] = []
    for (const suggestion of result.suggestions) {
      if (suggestion.placePrediction) {
        const text = suggestion.placePrediction.text.toString()
        predictionByText.set(text, suggestion.placePrediction)
        addresses.push(text)
      }
    }
    return { addresses: addresses, problem: '' }
  } catch (error) {
    console.warn('Google address suggestions are not available:', error)
    return { addresses: [], problem: 'Google suggestions failed. Enable "Places API (New)" for this key.' }
  }
}

// A place picked from the Google list, with its position on the map
export type PickedPlace = {
  // Short name, e.g. "Stonehenge"
  name: string
  // Full address, e.g. "Salisbury SP4 7DE, UK"
  address: string
  lat: number
  lng: number
}

// Asks Google for the name, address and map position of a suggestion the admin picked.
// Returns null if Google can't tell us (the admin then has to pick again).
export async function getPickedPlace(suggestionText: string): Promise<PickedPlace | null> {
  const prediction = predictionByText.get(suggestionText)
  if (!prediction) {
    return null
  }

  try {
    const place = prediction.toPlace()
    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] })
    if (!place.location) {
      return null
    }

    let name = suggestionText
    if (place.displayName) {
      name = place.displayName
    }
    let address = suggestionText
    if (place.formattedAddress) {
      address = place.formattedAddress
    }

    return { name: name, address: address, lat: place.location.lat(), lng: place.location.lng() }
  } catch (error) {
    console.warn('Could not get the map position of this place:', error)
    return null
  }
}

// Call after the admin picks an address, so the next search starts a new Google session
export function endPlacesSession(): void {
  sessionToken = null
}
