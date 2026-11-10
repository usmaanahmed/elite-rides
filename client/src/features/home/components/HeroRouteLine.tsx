// The journey path drawn across the hero. Coordinates are in the SVG's own 1440 x 900 space.
const ROUTE_PATH = 'M120 780 C 360 700, 520 860, 760 720 S 1060 420, 1460 140'

// Decorative journey line across the hero background: a faint path with orange dashes
// moving along it (pickup point on the left, like a car on its way).
// The dashes only move when the visitor hasn't asked for reduced motion.
export function HeroRouteLine() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        {/* Orange that fades in from the left and out towards the right */}
        <linearGradient id="hero-route-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fc6203" stopOpacity="0.15" />
          <stop offset="0.45" stopColor="#fc6203" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Faint full road */}
      <path d={ROUTE_PATH} stroke="white" strokeOpacity="0.06" strokeWidth="6" strokeLinecap="round" />

      {/* Moving orange dashes */}
      <path
        d={ROUTE_PATH}
        stroke="url(#hero-route-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 14"
        className="motion-safe:animate-route-flow"
      />

      {/* Pickup point with a soft halo */}
      <circle cx="120" cy="780" r="16" fill="#fc6203" fillOpacity="0.12" />
      <circle cx="120" cy="780" r="5" fill="#fc6203" />

      {/* A waypoint along the way */}
      <circle cx="760" cy="720" r="3.5" fill="white" fillOpacity="0.35" />
    </svg>
  )
}
