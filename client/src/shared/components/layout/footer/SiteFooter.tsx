import { FOOTER_COMPANY_LINKS, FOOTER_SERVICE_LINKS } from '../../../constants/footer'
import { FooterAirportLinks } from './FooterAirportLinks'
import { FooterBottomBar } from './FooterBottomBar'
import { FooterBrand } from './FooterBrand'
import { FooterCallToAction } from './FooterCallToAction'
import { FooterLinkColumn } from './FooterLinkColumn'
import { FooterRoadLine } from './FooterRoadLine'
import { FooterWordmark } from './FooterWordmark'

type SiteFooterProps = {
  // Show the big "Ready when you are" booking card at the top (default: yes).
  // The booking pages hide it, because the visitor is already booking.
  showCallToAction?: boolean
}

// Footer of every page, top to bottom: booking card, then the links section (logo + contact details
// beside the link columns, with the huge faded company name behind them), the journey-line divider
// and the copyright row. `isolate` keeps the background glows inside the footer.
export function SiteFooter({ showCallToAction = true }: SiteFooterProps) {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10">
      <FooterBackground />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {showCallToAction && (
          <div className="pt-20 sm:pt-24 lg:pt-28">
            <FooterCallToAction />
          </div>
        )}

        {/* Links section. The huge faded company name sits in its background, behind everything. */}
        <div className="relative isolate grid gap-14 pb-14 pt-20 sm:pt-24 lg:grid-cols-12 lg:gap-8 lg:pb-16">
          <FooterWordmark />

          <div className="lg:col-span-5 xl:col-span-4">
            <FooterBrand />
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:col-span-7 xl:col-span-7 xl:col-start-6"
          >
            <FooterLinkColumn title="Services" links={FOOTER_SERVICE_LINKS} />
            <FooterAirportLinks />
            <FooterLinkColumn title="Company" links={FOOTER_COMPANY_LINKS} />
          </nav>
        </div>

        <FooterRoadLine />

        <div className="py-8">
          <FooterBottomBar />
        </div>
      </div>
    </footer>
  )
}

// Decorative layers behind the footer: a thin orange light along the top edge,
// a soft orange glow under it, and a cool blue glow behind the big company name
function FooterBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
      <div className="absolute -top-48 left-1/2 h-96 w-4xl max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      <div className="absolute -bottom-48 -right-40 size-140 rounded-full bg-dusk/10 blur-[150px]" />
    </div>
  )
}
