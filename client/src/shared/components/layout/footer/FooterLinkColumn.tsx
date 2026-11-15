import type { NavLink } from '../../../types/navigation'
import { FooterLink } from './FooterLink'

type FooterLinkColumnProps = {
  title: string
  links: NavLink[]
}

// One column of footer links with a small heading, e.g. "Services"
export function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">{title}</h2>
      <ul className="mt-6 space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink label={link.label} href={link.href} />
          </li>
        ))}
      </ul>
    </div>
  )
}
