import { CarFront } from 'lucide-react'

// Divider above the footer's bottom row, drawn like a journey: an orange pickup dot on the left,
// orange dashes moving along the road, and a car at the end (same style as the hero's journey line).
// The dashes only move when the visitor hasn't asked for reduced motion.
export function FooterRoadLine() {
  return (
    <div aria-hidden="true" className="flex items-center gap-3">
      {/* Pickup point with a soft halo */}
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-accent/15">
        <span className="size-1.5 rounded-full bg-accent" />
      </span>

      {/* The road. No viewBox, so the dash sizes stay in pixels however wide the line is. */}
      <svg className="h-2 min-w-0 flex-1" fill="none">
        <line x1="0" y1="4" x2="100%" y2="4" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
        <line
          x1="0"
          y1="4"
          x2="100%"
          y2="4"
          stroke="#fc6203"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 14"
          className="motion-safe:animate-route-flow"
        />
      </svg>

      {/* Drop-off: the car */}
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-accent">
        <CarFront className="size-4" strokeWidth={1.75} />
      </span>
    </div>
  )
}
