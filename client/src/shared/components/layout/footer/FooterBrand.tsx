import { Logo } from '../../brand/Logo'
import { FooterContactList } from './FooterContactList'
import { FooterSocialLinks } from './FooterSocialLinks'

// Left part of the footer: logo, a short line about the company, contact details and social buttons
export function FooterBrand() {
  return (
    <div className="max-w-sm">
      <Logo />

      <p className="mt-7 text-[15px] leading-relaxed text-white/55">
        Airport transfers, executive travel and hourly Elite hire across London and the UK. Fixed fares and
        professional cabs, every single time.
      </p>

      <div className="mt-9">
        <FooterContactList />
      </div>

      <div className="mt-9">
        <FooterSocialLinks />
      </div>
    </div>
  )
}
