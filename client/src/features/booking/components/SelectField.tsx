import { ChevronDown, type LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { FIELD_CONTROL_CLASSES } from '../constants/fieldStyles'
import type { SelectOption } from '../types/booking'
import { FieldBox } from './FieldBox'

// Accepts every normal <select> prop, so React Hook Form's
// `{...register('fieldName')}` can be spread straight onto it.
type SelectFieldProps = ComponentProps<'select'> & {
  id: string
  label: string
  icon: LucideIcon
  options: SelectOption[]
  error?: string
}

// Dropdown inside a FieldBox, e.g. passengers, luggage, hours.
// Uses the browser's own dropdown, so phones show their native picker.
export function SelectField({ id, label, icon, options, error, ...selectProps }: SelectFieldProps) {
  return (
    <FieldBox label={label} htmlFor={id} icon={icon} error={error}>
      <select
        {...selectProps}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        // appearance-none hides the browser's arrow so ours (below) is the only one
        className={`${FIELD_CONTROL_CLASSES} cursor-pointer appearance-none pr-10`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Arrow sits on the value line (not the box centre) so it never covers a long label */}
      <ChevronDown
        className="pointer-events-none absolute right-4 top-[39px] size-4 -translate-y-1/2 text-muted"
        strokeWidth={2}
      />
    </FieldBox>
  )
}
