import type { SocialLink } from '../types/footer'
import type { NavLink } from '../types/navigation'

// Footer "Services" column. Like the main menu, these point to sections of the home page
// (the services section will be added later).
export const FOOTER_SERVICE_LINKS: NavLink[] = [
  { label: 'Airport transfers', href: '/#airports' },
  { label: 'Station transfers', href: '/#stations' },
  { label: 'Executive travel', href: '/#services' },
  { label: 'Hourly Elite hire', href: '/#services' },
]

// Footer "Company" column
export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { label: 'About us', href: '/#about' },
  { label: 'Our fleet', href: '/#fleet' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Get a quote', href: '/#quote' },
]

// Small links in the footer's bottom row.
// TODO: these pages don't exist yet. Create them (or change the links) before going live.
export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Terms & conditions', href: '/terms-and-conditions' },
  { label: 'Cookie policy', href: '/cookie-policy' },
]

// Round social buttons under the footer logo.
export const SOCIAL_LINKS: SocialLink[] = [
  { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/elitelondonrides' },
  { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/p/Elite-London-Rides-61573729423837/' },
  { network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/elite-london-rides-ltd/home/' },
]
