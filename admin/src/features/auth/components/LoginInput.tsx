import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

// Accepts every normal <input> prop (name, placeholder, onChange, ref…),
// so React Hook Form's `{...register('fieldName')}` can be spread straight onto it.
type LoginInputProps = ComponentProps<'input'> & {
  // Icon shown inside the left edge, e.g. a mail icon for the email field
  icon: LucideIcon
  hasError?: boolean
  // Extra content inside the right edge, e.g. the show/hide password button
  rightSlot?: ReactNode
}

// Large, touch-friendly input used on the login screen
export function LoginInput({ icon: Icon, hasError = false, rightSlot, id, ...inputProps }: LoginInputProps) {
  const stateClasses = hasError
    ? 'border-danger/70 focus-within:border-danger focus-within:ring-danger/10'
    : 'border-line focus-within:border-accent/60 focus-within:ring-accent/10'

  return (
    <div
      className={`group flex h-[54px] items-center gap-3 rounded-2xl border bg-surface-muted px-4 transition-all focus-within:bg-surface focus-within:ring-4 lg:h-12 ${stateClasses}`}
    >
      <Icon
        className="size-[18px] shrink-0 text-muted transition-colors group-focus-within:text-accent"
        strokeWidth={1.75}
      />
      <input
        {...inputProps}
        id={id}
        aria-invalid={hasError}
        // Links the input to the error text that FormField shows under it (for screen readers)
        aria-describedby={hasError ? `${id}-error` : undefined}
        // 16px text on phones stops iOS from zooming in when the input is tapped
        className="login-input h-full w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted/60 sm:text-[15px]"
      />
      {rightSlot}
    </div>
  )
}
