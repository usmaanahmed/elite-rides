import { ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getInitials } from '../../utils/getInitials'

type UserBadgeProps = {
  name: string
  role: string
  onSignOut: () => void
}

// Avatar + name button that opens a small dropdown with a Log out option
export function UserBadge({ name, role, onSignOut }: UserBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close the dropdown when clicking anywhere outside it, or pressing Escape
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleSignOutClick() {
    setIsOpen(false)
    onSignOut()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-nav-hover"
      >
        {/* Brand-colour ring around the avatar for a premium touch */}
        <span className="rounded-full bg-linear-to-br from-[#ff8a3d] to-[#e04f00] p-[2px]">
          <span className="grid size-8 place-items-center rounded-full bg-surface text-xs font-semibold text-ink">
            {getInitials(name)}
          </span>
        </span>

        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight text-ink">{name}</span>
          <span className="block text-xs leading-tight text-muted">{role}</span>
        </span>

        <ChevronDown className={`hidden size-4 text-muted transition-transform sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lg">
          <button
            type="button"
            onClick={handleSignOutClick}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-nav-hover dark:text-red-400"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
