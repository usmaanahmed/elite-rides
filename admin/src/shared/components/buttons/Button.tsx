import { LoaderCircle, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  icon?: LucideIcon
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  // Shows a spinner and blocks clicks, e.g. while a form is saving
  isLoading?: boolean
  // Id of the <form> this button submits. Only needed when the button sits
  // outside the form, like a "Save" button in a modal footer.
  form?: string
  className?: string
}

const variantClasses = {
  primary: 'bg-accent text-white shadow-[0_6px_16px_-6px_rgba(252,98,3,0.6)] hover:brightness-95',
  secondary: 'border border-line bg-surface text-ink shadow-sm hover:bg-nav-hover',
  ghost: 'text-muted hover:bg-nav-hover hover:text-ink',
}

export function Button({
  children,
  variant = 'primary',
  icon: Icon,
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  form,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      form={form}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {isLoading && <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />}
      {!isLoading && Icon && <Icon className="size-4" strokeWidth={2} />}
      {children}
    </button>
  )
}
