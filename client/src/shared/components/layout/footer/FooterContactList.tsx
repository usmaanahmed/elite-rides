import type { LucideIcon } from 'lucide-react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { COMPANY } from '../../../constants/company'

// Phone, email and location under the footer logo, each with an icon tile and a small label
export function FooterContactList() {
  return (
    <ul className="space-y-4">
      <FooterContactItem icon={Phone} label="Call us" value={COMPANY.phoneDisplay} href={COMPANY.phoneLink} />
      <FooterContactItem icon={Mail} label="Email us" value={COMPANY.email} href={COMPANY.emailLink} />
      <FooterContactItem icon={MapPin} label="Address" value={COMPANY.location} />
    </ul>
  )
}

type FooterContactItemProps = {
  icon: LucideIcon
  // Small grey word above the value, e.g. "Call us"
  label: string
  value: string
  // Leave out when the value is not clickable (e.g. the location)
  href?: string
}

// One contact row. Rows with a link turn the icon tile orange on hover.
function FooterContactItem({ icon, label, value, href }: FooterContactItemProps) {
  const Icon = icon

  const content = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent transition duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
        <Icon aria-hidden="true" className="size-4.5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</span>
        <span className="mt-1 block text-[15px] font-medium text-white/85 transition-colors group-hover:text-white">
          {value}
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <li>
        <a href={href} className="group flex items-center gap-4">
          {content}
        </a>
      </li>
    )
  }

  return <li className="flex items-center gap-4">{content}</li>
}
