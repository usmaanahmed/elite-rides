// Google address suggestions ("Places API (New)"), loaded with a plain <script> tag (no npm package).
// If the key is missing or Google fails, the suggestions are simply empty: the customer can still type.

const API_KEY: string = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()
const CALLBACK_NAME = 'eliteRidesGoogleMapsReady'

// The small part of Google's library we use (written by hand, so no extra types package is needed)
type PlacePrediction = {
  text: { toString: () => string }
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

// Google's suggested UK addresses for what the customer has typed, e.g. "heath" -> "Heathrow Airport, …"
export async function fetchPlaceSuggestions(text: string): Promise<string[]> {
  try {
    const isReady = await loadGoogleMaps()
    const google = getGoogle()
    if (!isReady || !google) {
      return []
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
        addresses.push(suggestion.placePrediction.text.toString())
      }
    }
    return addresses
  } catch (error) {
    console.warn('Google address suggestions are not available:', error)
    return []
  }
}

// Call after the customer picks an address, so the next search starts a new Google session
export function endPlacesSession(): void {
  sessionToken = null
}
