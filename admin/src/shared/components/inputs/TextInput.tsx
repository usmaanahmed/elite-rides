import type { ComponentProps } from 'react'

// Accepts every normal <input> prop (name, placeholder, onChange, ref…),
// so React Hook Form's `{...register('fieldName')}` can be spread straight onto it.
type TextInputProps = ComponentProps<'input'> & {
  hasError?: boolean
  // Short text shown inside the left edge of the box, e.g. "£"
  prefix?: string
  // Short text shown inside the right edge of the box, e.g. "%" or "seats"
  suffix?: string
}

export function TextInput({ hasError = false, prefix, suffix, id, ...inputProps }: TextInputProps) {
  const stateClasses = hasError
    ? 'border-danger/70 focus-within:border-danger focus-within:ring-danger/10'
    : 'border-line focus-within:border-accent/50 focus-within:ring-accent/10'

  return (
    <div
      className={`flex h-11 items-center gap-2 rounded-xl border bg-surface px-3.5 transition-all focus-within:ring-4 ${stateClasses}`}
    >
      {prefix && <span className="shrink-0 text-sm text-muted">{prefix}</span>}
      <input
        {...inputProps}
        id={id}
        aria-invalid={hasError}
        // Links the input to the error text that FormField shows under it (for screen readers)
        aria-describedby={hasError ? `${id}-error` : undefined}
        // 16px text on phones stops iOS from zooming in when the input is tapped
        className="h-full w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted/70 sm:text-sm"
      />
      {suffix && <span className="shrink-0 text-sm text-muted">{suffix}</span>}
    </div>
  )
}
