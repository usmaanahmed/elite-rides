// Turns any text into a web address slug (same rules as the server)
// e.g. "Heathrow Airport: Top 5 Tips!" -> "heathrow-airport-top-5-tips"
export function makeSlug(text: string): string {
  let slug = text.toLowerCase().trim()

  // Turn letters like "é" into a plain "e"
  slug = slug.normalize('NFD').replace(/[̀-ͯ]/g, '')

  // Drop apostrophes, so "driver's" becomes "drivers" (not "driver-s")
  slug = slug.replace(/['’]/g, '')

  // Everything that is not a letter or number becomes a dash
  slug = slug.replace(/[^a-z0-9]+/g, '-')

  // Remove dashes from the start and the end
  slug = slug.replace(/^-+/, '').replace(/-+$/, '')

  return slug
}
