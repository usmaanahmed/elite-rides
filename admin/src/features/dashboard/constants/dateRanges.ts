import type { SegmentedControlOption } from '../../../shared/components/inputs/SegmentedControl'
import type { DateRange } from '../types/dashboard'

// The buttons in the date range picker
export const DATE_RANGE_OPTIONS: SegmentedControlOption[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '12m', label: '12M' },
]

// e.g. "the last 30 days", used in sentences on the page
export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  '7d': 'the last 7 days',
  '30d': 'the last 30 days',
  '90d': 'the last 90 days',
  '12m': 'the last 12 months',
}

// Shown under numbers that are compared with the period before
export const COMPARISON_LABELS: Record<DateRange, string> = {
  '7d': 'vs previous 7 days',
  '30d': 'vs previous 30 days',
  '90d': 'vs previous 90 days',
  '12m': 'vs previous 12 months',
}
