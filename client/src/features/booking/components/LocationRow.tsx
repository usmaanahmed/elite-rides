import { X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { FIELD_CONTROL_CLASSES, FIELD_LABEL_CLASSES } from '../constants/fieldStyles'
import type { RouteMarkerType } from '../types/booking'
import { RouteMarker } from './RouteMarker'

// Accepts every normal <input> prop, so React Hook Form's
// `{...register('fieldName')}` can be spread straight onto it.
type LocationRowProps = ComponentProps<'input'> & {
  id: string
  label: string
  marker: RouteMarkerType
  hasError?: boolean
  // Thin line above the row (every row except the first)
  showDivider?: boolean
  // Only for stops: shows an "x" button that removes the row
  onRemove?: () => void
  removeLabel?: string
}

// One address row inside the route box (pickup, a stop, or drop-off)
export function LocationRow({
  id,
  label,
  marker,
  hasError = false,
  showDivider = false,
  onRemove,
  removeLabel,
  ...inputProps
}: LocationRowProps) {
  const labelColor = hasError ? 'text-danger' : 'text-muted'

  return (
    <div className="relative h-15 transition-colors focus-within:bg-surface">
      {showDivider && <span aria-hidden="true" className="absolute left-12 right-0 top-0 border-t border-line" />}
      <RouteMarker type={marker} />
      <label htmlFor={id} className={`${FIELD_LABEL_CLASSES} ${labelColor}`}>
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        type="text"
        // Stops the browser's own suggestions covering the field (Google suggestions come later)
        autoComplete="off"
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        // pr-13 leaves room for the swap or remove button on the right
        className={`${FIELD_CONTROL_CLASSES} pr-13`}
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
