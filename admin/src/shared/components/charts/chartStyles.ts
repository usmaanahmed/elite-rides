// Shared look for every Recharts chart, so they all match the design system.
// Colours are CSS variables from index.css, which means charts switch to
// dark mode automatically along with the rest of the app.

export const CHART_COLORS = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  muted: 'var(--muted)',
  grid: 'var(--chart-grid)',
  surface: 'var(--surface)',
  // Soft band drawn behind the bar under the pointer
  hoverBand: 'var(--nav-hover)',
}

// Axis label text: small, muted and quiet so the data stands out
export const AXIS_TICK_STYLE = {
  fill: 'var(--muted)',
  fontSize: 11,
  fontWeight: 500,
}

// The vertical hairline that follows the pointer on line and area charts
export const CROSSHAIR_CURSOR = {
  stroke: 'var(--muted)',
  strokeWidth: 1,
  strokeOpacity: 0.5,
}

// The dot shown on a line where the pointer is. The ring in the card's colour
// keeps it readable where it sits on top of the line.
export const ACTIVE_DOT = {
  r: 5,
  strokeWidth: 2,
  stroke: 'var(--surface)',
}
