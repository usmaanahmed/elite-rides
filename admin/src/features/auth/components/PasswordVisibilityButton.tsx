import { Eye, EyeOff } from 'lucide-react'

type PasswordVisibilityButtonProps = {
  isPasswordVisible: boolean
  onToggle: () => void
}

// Eye icon inside the password field that shows or hides the typed password
export function PasswordVisibilityButton({ isPasswordVisible, onToggle }: PasswordVisibilityButtonProps) {
  const label = isPasswordVisible ? 'Hide password' : 'Show password'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="-mr-2 grid size-10 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-nav-hover hover:text-ink"
    >
      {isPasswordVisible && <EyeOff className="size-[18px]" strokeWidth={1.75} />}
      {!isPasswordVisible && <Eye className="size-[18px]" strokeWidth={1.75} />}
    </button>
  )
}
