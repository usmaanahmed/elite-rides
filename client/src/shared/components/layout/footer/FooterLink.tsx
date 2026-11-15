import { ArrowUpRight } from 'lucide-react'

type FooterLinkProps = {
  label: string
  href: string
}

// One link in a footer column. On hover the text turns white and a small orange arrow slides in.
export function FooterLink({ label, href }: FooterLinkProps) {
  return (
    <a href={href} className="group inline-flex items-center gap-1.5 text-[15px] text-white/60 transition-colors hover:text-white">
      {label}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 -translate-x-1 text-accent-bright opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        strokeWidth={2}
      />
    </a>
  )
}
