import { COMPANY } from '../../../constants/company'
import { SOCIAL_LINKS } from '../../../constants/footer'
import { SocialIcon } from './SocialIcon'

// Row of round social buttons. On hover a button lifts a little and fills with orange.
// The links open in a new tab.
export function FooterSocialLinks() {
  return (
    <ul className="flex items-center gap-2.5">
      {SOCIAL_LINKS.map((social) => (
        <li key={social.network}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${COMPANY.name} on ${social.label}`}
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/65 transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white hover:shadow-[0_10px_24px_-10px_rgba(252,98,3,0.9)]"
          >
            <SocialIcon network={social.network} />
          </a>
        </li>
      ))}
    </ul>
  )
}
