import { CarFront } from 'lucide-react'
import { COMPANY } from '../../constants/company'

// Brand logo: the same orange car mark as the admin panel's sidebar + the company name.
// Links back to the home page.
export function Logo() {
  return (
    <a href="/" className="flex items-center gap-3" aria-label={`${COMPANY.name} home`}>
      <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-[#ff8a3d] to-[#e04f00] text-white shadow-[0_6px_16px_-6px_rgba(252,98,3,0.7)]">
        <CarFront className="size-5" strokeWidth={2} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold uppercase tracking-[0.2em] text-white">{COMPANY.name}</span>
        <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-white/45">
          {COMPANY.tagline}
        </span>
      </span>
    </a>
  )
}
