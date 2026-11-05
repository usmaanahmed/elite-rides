import { Bell, CarFront } from 'lucide-react'
import { useIsScrolled } from '../../hooks/useIsScrolled'
import { getInitials } from '../../utils/getInitials'

type MobileTopbarProps = {
  pageTitle: string
  hasUnreadNotifications: boolean
  userName: string
  onAvatarClick: () => void
}

// App bar shown at the top of the screen on phones and tablets.
// Like iOS, the page's big heading scrolls away and a small copy of the title fades in here.
export function MobileTopbar({ pageTitle, hasUnreadNotifications, userName, onAvatarClick }: MobileTopbarProps) {
  const isScrolled = useIsScrolled(48)

  return (
    <header
      className={`sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-colors duration-200 lg:hidden ${isScrolled ? 'border-line bg-canvas/90' : 'border-transparent bg-canvas'}`}
    >
      <div className="relative flex h-14 items-center gap-2 px-4">
        {/* Brand: logo with the app name, which hides once the page title takes over */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-[#ff8a3d] to-[#e04f00] text-white shadow-[0_6px_14px_-6px_rgba(252,98,3,0.7)]">
            <CarFront className="size-4" strokeWidth={2.25} />
          </div>
          <span
            className={`truncate text-[15px] font-semibold tracking-tight text-ink transition-opacity duration-200 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
          >
            Elite Rides
          </span>
        </div>

        {/* Small centred page title, visible only after scrolling */}
        <p
          aria-hidden={!isScrolled}
          className={`pointer-events-none absolute inset-x-24 truncate text-center text-[15px] font-semibold text-ink transition-all duration-200 ${isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
        >
          {pageTitle}
        </p>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid size-10 place-items-center rounded-full text-ink transition-colors active:bg-nav-hover"
          >
            <Bell className="size-[21px]" strokeWidth={1.75} />
            {hasUnreadNotifications && (
              <span className="absolute right-[9px] top-[9px] size-2 rounded-full bg-accent ring-2 ring-canvas" />
            )}
          </button>

          <button
            type="button"
            onClick={onAvatarClick}
            aria-label="Open account menu"
            className="rounded-full bg-linear-to-br from-[#ff8a3d] to-[#e04f00] p-[2px] transition-transform active:scale-95"
          >
            <span className="grid size-8 place-items-center rounded-full bg-surface text-xs font-semibold text-ink">
              {getInitials(userName)}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
