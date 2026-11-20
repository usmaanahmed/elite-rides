// Google address suggestions ("Places API (New)"), loaded with a plain <script> tag (no npm package).
// If the key is missing or Google fails, the suggestions are simply empty: the customer can still type.

const API_KEY: string = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()
const CALLBACK_NAME = 'eliteRidesGoogleMapsReady'

// The small part of Google's library we use (written by hand, so no extra types package is needed)
type PlaceAddressComponent = {
  longText: string | null
  types: string[]
}

type PlaceDetails = {
  fetchFields: (request: { fields: string[] }) => Promise<unknown>
  addressComponents?: PlaceAddressComponent[]
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
// Remembers Google's prediction for each suggested text, so we can ask for its postcode when it is picked
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

// Google's answer: the addresses, plus a short reason when something went wrong (empty when all is fine)
export type PlaceSuggestionsResult = {
  addresses: string[]
  problem: string
}

// Google's suggested UK addresses for what the customer has typed, e.g. "heath" -> "Heathrow Airport, …"
export async function fetchPlaceSuggestions(text: string): Promise<PlaceSuggestionsResult> {
  try {
    const isReady = await loadGoogleMaps()
    const google = getGoogle()
    if (!isReady || !google) {
      return { addresses: [], problem: 'Google Maps could not load. Check the API key and its allowed websites (localhost:5174).' }
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

// A picked Google address often has no postcode (e.g. "Leonardo Hotel London Croydon, Wellesley Road, Croydon, UK"),
// but fixed prices are matched by postcode. So we ask Google for the postcode and add it at the end:
// "Leonardo Hotel London Croydon, Wellesley Road, Croydon, UK CR0 9XY".
// If anything fails, the address is returned unchanged.
export async function addPostcodeToAddress(address: string): Promise<string> {
  const prediction = predictionByText.get(address)
  if (!prediction) {
    return address
  }

  try {
    const place = prediction.toPlace()
    await place.fetchFields({ fields: ['addressComponents'] })

    const components = place.addressComponents || []
    for (const component of components) {
      if (component.types.includes('postal_code') && component.longText) {
        const postcode = component.longText
        // Already in the text (with or without space)? Then nothing to add
        if (address.replace(/\s+/g, '').toUpperCase().includes(postcode.replace(/\s+/g, '').toUpperCase())) {
          return address
        }
        return `${address} ${postcode}`
      }
    }
  } catch (error) {
    console.warn('Could not get the postcode for this address:', error)
  }
  return address
}

// Call after the customer picks an address, so the next search starts a new Google session
export function endPlacesSession(): void {
  sessionToken = null
}
