import { Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { COMPANY } from '../../constants/company'
import { NAV_LINKS } from '../../constants/navigation'
import { Logo } from '../brand/Logo'
import { MobileMenu } from './MobileMenu'

// Top bar of the website: logo, menu links, phone number and "Book now" button.
// It has no background of its own, so it sits on top of the dark hero.
// A little shorter on short laptop screens (`short:h-16`), so the hero fits on one screen.
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function toggleMenu(): void {
    setIsMenuOpen(!isMenuOpen)
  }

  function closeMenu(): void {
    setIsMenuOpen(false)
  }

  return (
    <header className="relative z-20 pt-4 sm:pt-6 short:pt-3">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 short:h-16">
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-white/70 2xl:px-4 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={COMPANY.phoneLink}
            className="hidden items-center gap-2 whitespace-nowrap text-sm font-semibold text-white/85 transition-colors hover:text-white xl:inline-flex"
          >
            <Phone className="size-4 text-accent" strokeWidth={2} />
            {COMPANY.phoneDisplay}
          </a>
          <a
            href="/#quote"
            className="hidden h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-accent hover:text-white sm:inline-flex"
          >
            Book now
          </a>

          {/* Menu button, only on phones and tablets */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            {isMenuOpen ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {isMenuOpen && <MobileMenu onClose={closeMenu} />}
    </header>
  )
}
