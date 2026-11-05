import { CircleAlert, type LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

export type RadioOption = {
  value: string
  label: string
  icon?: LucideIcon
}

// Accepts every normal <input> prop, so React Hook Form's `{...register('fieldName')}`
// can be spread straight onto it. It is passed to every radio, which is how RHF expects radios.
type RadioGroupProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
  options: RadioOption[]
  // Validation message shown under the choices
  error?: string
  className?: string
}

// A row of choices where exactly one can be picked, e.g. Address / Airport / Station.
// Uses a <fieldset> instead of FormField because a group of radios has no single input for a label to point at.
export function RadioGroup({ label, options, error, className = '', id, ...inputProps }: RadioGroupProps) {
  const groupId = id ?? inputProps.name

  return (
    <fieldset className={className} aria-describedby={error ? `${groupId}-error` : undefined}>
      <legend className="mb-1.5 text-sm font-medium text-ink">{label}</legend>

      <div className="grid grid-cols-3 gap-2.5">
        {options.map((option) => {
          const Icon = option.icon

          return (
            <label
              key={option.value}
              // has-checked / has-focus-visible style the box from the hidden radio inside it
              className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-surface px-3 text-sm font-medium text-muted transition-all hover:text-ink has-checked:border-accent/60 has-checked:bg-accent-soft has-checked:text-accent-ink has-focus-visible:ring-4 has-focus-visible:ring-accent/10 ${error ? 'border-danger/70' : 'border-line'}`}
            >
              <input {...inputProps} type="radio" value={option.value} className="sr-only" />
              {Icon && <Icon className="size-4 shrink-0" strokeWidth={2} />}
              <span className="truncate">{option.label}</span>
            </label>
          )
        })}
      </div>

      {error && (
        <p id={`${groupId}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger">
          <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={2} />
          {error}
        </p>
      )}
    </fieldset>
  )
}
