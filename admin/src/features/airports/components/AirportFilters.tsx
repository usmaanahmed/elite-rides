import { X } from 'lucide-react'
import { Button } from '../../../shared/components/buttons/Button'
import { SelectInput, type SelectOption } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { AirportFilterValues, AirportImagesFilter } from '../types/airport'

type AirportFiltersProps = {
  filters: AirportFilterValues
  onChange: (filters: AirportFilterValues) => void
  onClear: () => void
}

const IMAGE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All airports' },
  { value: 'with-images', label: 'With images' },
  { value: 'without-images', label: 'Without images' },
]

// The filter bar above the airports table: name, address and images
export function AirportFilters({ filters, onChange, onClear }: AirportFiltersProps) {
  const hasActiveFilter = filters.name !== '' || filters.address !== '' || filters.images !== 'all'

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_12rem_auto] lg:items-center">
      <TextInput
        aria-label="Filter by airport name"
        placeholder="Filter by name"
        value={filters.name}
        onChange={(event) => onChange({ ...filters, name: event.target.value })}
      />
      <TextInput
        aria-label="Filter by address"
        placeholder="Filter by address"
        value={filters.address}
        onChange={(event) => onChange({ ...filters, address: event.target.value })}
      />
      <SelectInput
        aria-label="Filter by images"
        options={IMAGE_OPTIONS}
        value={filters.images}
        onChange={(event) => onChange({ ...filters, images: event.target.value as AirportImagesFilter })}
      />
      {hasActiveFilter && (
        <Button variant="secondary" icon={X} onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  )
}
