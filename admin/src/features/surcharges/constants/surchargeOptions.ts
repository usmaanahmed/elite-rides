import type { SelectOption } from '../../../shared/components/inputs/SelectInput'

// Choices for the "Status" dropdown
export const STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

// Choices for the "Amount type" dropdown
export const AMOUNT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'fixed', label: 'Fixed amount (£)' },
  { value: 'percent', label: 'Percentage (%)' },
]
