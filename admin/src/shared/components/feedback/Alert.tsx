import { CircleAlert, CircleCheck, X } from 'lucide-react'

type AlertVariant = 'success' | 'error'

type AlertProps = {
  variant: AlertVariant
  title: string
  description?: string
  // When given, an "x" button is shown that calls this
  onDismiss?: () => void
  className?: string
}

const variantClasses = {
  success: 'border-success/25 bg-success-soft text-success',
  error: 'border-danger/25 bg-danger-soft text-danger',
}

export function Alert({ variant, title, description, onDismiss, className = '' }: AlertProps) {
  const Icon = variant === 'success' ? CircleCheck : CircleAlert

  return (
    <div role="status" className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${variantClasses[variant]} ${className}`}>
      <Icon className="mt-0.5 size-[18px] shrink-0" strokeWidth={2} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-0.5 text-sm text-ink/70">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 grid size-7 shrink-0 place-items-center rounded-lg opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
