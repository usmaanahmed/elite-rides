import { Phone } from 'lucide-react'
import { COMPANY } from '../../constants/company'
import { NAV_LINKS } from '../../constants/navigation'

type MobileMenuProps = {
  // Called when a link is tapped, so the menu closes after navigating
  onClose: () => void
}

// Drop-down menu for phones and tablets (the desktop header shows the links inline instead)
export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      className="absolute inset-x-4 top-full z-30 rounded-3xl border border-white/10 bg-night-raised/95 p-3 shadow-2xl backdrop-blur-xl motion-safe:animate-fade-in sm:inset-x-6 lg:hidden"
    >
      <nav aria-label="Mobile">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={onClose}
                className="flex h-12 items-center rounded-2xl px-4 text-[15px] font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-2 grid gap-2 border-t border-white/10 pt-3">
        <a
          href={COMPANY.phoneLink}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 text-sm font-semibold text-white"
        >
          <Phone className="size-4 text-accent" strokeWidth={2} />
          {COMPANY.phoneDisplay}
        </a>
        <a
          href="/#quote"
          onClick={onClose}
          className="flex h-12 items-center justify-center rounded-2xl bg-accent text-sm font-semibold text-white"
        >
          Book now
        </a>
      </div>
    </div>
  )
}
