import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { FIELD_LABEL_CLASSES } from '../constants/fieldStyles'
import { FieldError } from './FieldError'

type FieldBoxProps = {
  label: string
  // Id of the input/select inside, so clicking the label focuses it
  htmlFor: string
  icon: LucideIcon
  error?: string
  // The input/select itself. Give it FIELD_CONTROL_CLASSES so it fills the box.
  children: ReactNode
}

// Rounded box with an icon on the left and a small label above the value.
// Used by every single field on the booking card (date, time, passengers…).
export function FieldBox({ label, htmlFor, icon: Icon, error, children }: FieldBoxProps) {
  const hasError = Boolean(error)

  let borderClasses = 'border-line focus-within:border-accent/50 focus-within:ring-accent/10'
  let iconClasses = 'text-muted group-focus-within:text-accent-ink'
  let labelColor = 'text-muted'
  if (hasError) {
    borderClasses = 'border-danger/60 focus-within:ring-danger/10'
    iconClasses = 'text-danger'
    labelColor = 'text-danger'
  }

  return (
    <div>
      <div
        className={`group relative h-15 rounded-2xl border bg-surface-muted transition focus-within:bg-surface focus-within:ring-4 ${borderClasses}`}
      >
        <Icon
          className={`pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 transition-colors ${iconClasses}`}
          strokeWidth={1.75}
        />
        <label htmlFor={htmlFor} className={`${FIELD_LABEL_CLASSES} ${labelColor}`}>
          {label}
        </label>
        {children}
      </div>
      <FieldError id={`${htmlFor}-error`} message={error} />
    </div>
  )
}
