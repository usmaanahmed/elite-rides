import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'

export type SelectOption = {
  value: string
  label: string
}

// Accepts every normal <select> prop, so React Hook Form's
// `{...register('fieldName')}` can be spread straight onto it.
type SelectInputProps = ComponentProps<'select'> & {
  options: SelectOption[]
  // Greyed-out first choice shown while nothing is picked, e.g. "Select a vehicle"
  placeholder?: string
  hasError?: boolean
}

// Uses the browser's own dropdown, so phones show their native picker
export function SelectInput({ options, placeholder, hasError = false, id, ...selectProps }: SelectInputProps) {
  const stateClasses = hasError
    ? 'border-danger/70 focus:border-danger focus:ring-danger/10'
    : 'border-line focus:border-accent/50 focus:ring-accent/10'

  return (
    <div className="relative">
      <select
        // While the empty placeholder choice is picked, a `required` select counts as :invalid,
        // which is how the placeholder text is greyed out below. Pass required={false} to turn this off.
        required={placeholder !== undefined}
        {...selectProps}
        id={id}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        // appearance-none hides the browser's arrow so ours (below) is the only one
        className={`h-11 w-full cursor-pointer appearance-none rounded-xl border bg-surface pl-3.5 pr-10 text-base text-ink outline-none transition-all invalid:text-muted/70 focus:ring-4 sm:text-sm ${stateClasses}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
        strokeWidth={2}
      />
    </div>
  )
}
