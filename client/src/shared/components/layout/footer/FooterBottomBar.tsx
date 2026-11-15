import { COMPANY } from '../../../constants/company'
import { FOOTER_LEGAL_LINKS } from '../../../constants/footer'
import { BackToTopButton } from './BackToTopButton'

// Last row of the footer: copyright on the left, legal links and "Back to top" on the right.
// Phones: everything stacks.
export function FooterBottomBar() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-white/45">
        © {currentYear} {COMPANY.legalName}. All rights reserved.
      </p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
        <nav aria-label="Legal">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-white/45 transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <BackToTopButton />
      </div>
    </div>
  )
}
