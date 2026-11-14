import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../../shared/hooks/useTheme'

// Round light/dark mode switch in the top-right corner of the login screen.
// Phones: frosted-glass button floating over the photo. Laptops: plain button on the form side.
export function LoginThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="absolute right-6 top-[calc(env(safe-area-inset-top)+1.5rem)] z-20 grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors active:bg-white/20 lg:right-8 lg:top-8 lg:border-line lg:bg-surface lg:text-muted lg:backdrop-blur-none lg:hover:bg-nav-hover lg:hover:text-ink"
    >
      {isDark && <Sun className="size-[18px]" strokeWidth={1.75} />}
      {!isDark && <Moon className="size-[18px]" strokeWidth={1.75} />}
    </button>
  )
}
