import { X } from 'lucide-react'
import { Button } from '../../../shared/components/buttons/Button'
import { SelectInput, type SelectOption } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { EventFilterValues, EventImagesFilter } from '../types/event'

type EventFiltersProps = {
  filters: EventFilterValues
  onChange: (filters: EventFilterValues) => void
  onClear: () => void
}

const IMAGE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All events' },
  { value: 'with-images', label: 'With images' },
  { value: 'without-images', label: 'Without images' },
]

// The filter bar above the events table: name and images
export function EventFilters({ filters, onChange, onClear }: EventFiltersProps) {
  const hasActiveFilter = filters.name !== '' || filters.images !== 'all'

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_auto] lg:items-center">
      <TextInput
        aria-label="Filter by event name"
        placeholder="Filter by name"
        value={filters.name}
        onChange={(event) => onChange({ ...filters, name: event.target.value })}
      />
      <SelectInput
        aria-label="Filter by images"
        options={IMAGE_OPTIONS}
        value={filters.images}
        onChange={(event) => onChange({ ...filters, images: event.target.value as EventImagesFilter })}
      />
      {hasActiveFilter && (
        <Button variant="secondary" icon={X} onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  )
}
