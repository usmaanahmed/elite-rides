// Number formatters shared by stat cards, charts and tooltips.
// Intl.NumberFormat adds the £ sign and thousands separators the British way.

const poundsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

const compactPoundsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const countFormatter = new Intl.NumberFormat('en-GB')

const compactCountFormatter = new Intl.NumberFormat('en-GB', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

// 48210.4 → "£48,210"
export function formatPounds(value: number): string {
  return poundsFormatter.format(value)
}

// 48210 → "£48.2K" (for chart axes, where space is tight)
export function formatCompactPounds(value: number): string {
  return compactPoundsFormatter.format(value)
}

// 1284 → "1,284"
export function formatCount(value: number): string {
  return countFormatter.format(value)
}

// 12900 → "12.9K"
export function formatCompactCount(value: number): string {
  return compactCountFormatter.format(value)
}

// 0.4237 → "42.4%"
export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`
}
