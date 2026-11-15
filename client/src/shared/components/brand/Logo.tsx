import { COMPANY } from '../../constants/company'

// Brand logo: the company logo image + the company name.
// Links back to the home page.
export function Logo() {
  return (
    <a href="/" className="flex items-center gap-3" aria-label={`${COMPANY.name} home`}>
      <img src="/elite-logo.webp" alt="" className="size-12 rounded-xl bg-white object-contain" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold uppercase tracking-[0.2em] text-white">{COMPANY.name}</span>
        <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-white/45">
          {COMPANY.tagline}
        </span>
      </span>
    </a>
  )
}
