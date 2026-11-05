import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  // Id of the input inside, so clicking the label focuses it
  htmlFor: string
  // Validation message; when set it replaces the hint and turns red
  error?: string
  // Grey help text under the input
  hint?: string
  isOptional?: boolean
  // Extra content on the right of the label, e.g. a "120 / 500" character counter
  labelExtra?: ReactNode
  children: ReactNode
  className?: string
}

// Label + input + hint/error, laid out the same way for every field in every form
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  isOptional = false,
  labelExtra,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {isOptional && <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>}
        </label>
        {labelExtra}
      </div>

      {children}

      {/* The id matches the aria-describedby that TextInput / TextArea set when they have an error */}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger">
          <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={2} />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  )
}
