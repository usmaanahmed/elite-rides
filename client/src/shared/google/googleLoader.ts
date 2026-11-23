// Loads Google's Maps JavaScript library once, with a plain <script> tag (no npm package).
// Used by the address suggestions (googlePlaces.ts) and by the tour journey map.

const API_KEY: string = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()
const CALLBACK_NAME = 'eliteRidesGoogleMapsReady'

// The only part of the global "google" object we touch here. Each feature asks for the
// library it needs with importLibrary('places'), importLibrary('maps'), ...
export type GoogleGlobal = {
  maps: { importLibrary: (name: string) => Promise<unknown> }
}

// Loading starts once and is shared by every part of the website
let loadingPromise: Promise<boolean> | null = null

export function getGoogle(): GoogleGlobal | undefined {
  return (window as unknown as { google?: GoogleGlobal }).google
}

// Adds Google's script to the page. Resolves true when ready, false if it can't load (e.g. no API key).
export function loadGoogleMaps(): Promise<boolean> {
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
