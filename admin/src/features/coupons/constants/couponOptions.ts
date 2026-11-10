import type { SelectOption } from '../../../shared/components/inputs/SelectInput'

// Choices for the "Discount type" dropdown
export const DISCOUNT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'percent', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed amount (£)' },
]

// Choices for the "Status" dropdown
export const COUPON_STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]
