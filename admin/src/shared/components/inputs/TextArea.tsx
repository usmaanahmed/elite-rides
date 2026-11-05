import type { ComponentProps } from 'react'

// Multi-line version of TextInput. Accepts every normal <textarea> prop,
// so React Hook Form's `{...register('fieldName')}` can be spread straight onto it.
type TextAreaProps = ComponentProps<'textarea'> & {
  hasError?: boolean
}

export function TextArea({ hasError = false, id, rows = 3, ...textAreaProps }: TextAreaProps) {
  const stateClasses = hasError
    ? 'border-danger/70 focus:border-danger focus:ring-danger/10'
    : 'border-line focus:border-accent/50 focus:ring-accent/10'

  return (
    <textarea
      {...textAreaProps}
      id={id}
      rows={rows}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${id}-error` : undefined}
      className={`block w-full resize-y rounded-xl border bg-surface px-3.5 py-2.5 text-base text-ink outline-none transition-all placeholder:text-muted/70 focus:ring-4 sm:text-sm ${stateClasses}`}
    />
  )
}
