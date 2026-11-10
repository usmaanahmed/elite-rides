import { HeroRouteLine } from './HeroRouteLine'

// Decorative layers behind the hero content (purely visual, hidden from screen readers):
// warm orange glow, cool city-light glow, faint map grid, the journey line, and a fade at the bottom.
export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Orange glow behind the booking card */}
      <div className="absolute -right-48 -top-48 size-[720px] rounded-full bg-accent/15 blur-[140px]" />

      {/* Cool blue glow in the bottom left, like city lights at night */}
      <div className="absolute -bottom-64 -left-48 size-[640px] rounded-full bg-dusk/15 blur-[140px]" />

      {/* Faint map grid (style in index.css) */}
      <div className="map-grid absolute inset-0" />

      <HeroRouteLine />

      {/* Darkens the bottom edge so the hero blends into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-night to-transparent" />
    </div>
  )
}
