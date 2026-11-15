// Google Maps links for an address (no API key needed)

// Opens the address in Google Maps (new tab, or the Maps app on phones)
export function buildGoogleMapsLink(address: string): string {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address)
}

// Small map of the address, for an <iframe> on the page
export function buildMapEmbedLink(address: string): string {
  return 'https://www.google.com/maps?output=embed&q=' + encodeURIComponent(address)
}
