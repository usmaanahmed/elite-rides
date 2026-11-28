import { Phone } from 'lucide-react'
import { useState } from 'react'
import { COMPANY } from '../../../shared/constants/company'
import { usePublicFaqs } from '../hooks/usePublicFaqs'
import { FaqItem } from './FaqItem'

// "FAQ" section on the home page (the menu's "FAQs" link jumps here with /#faq).
// Heading on the left, the list of questions on the right. Clicking a question (plus icon)
// opens its answer. It stays hidden while loading, on an error and when there are no FAQs.
export function FaqSection() {
  const faqsQuery = usePublicFaqs()
  // The id of the question that is open right now (null = all closed). Only one is open at a time.
  const [openFaqId, setOpenFaqId] = useState<string | null>(null)

  if (faqsQuery.isPending || faqsQuery.isError || faqsQuery.data.length === 0) {
    return null
  }

  function toggleFaq(faqId: string): void {
    if (openFaqId === faqId) {
      setOpenFaqId(null)
    } else {
      setOpenFaqId(faqId)
    }
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative isolate overflow-hidden border-t border-white/10 py-24 sm:py-28 lg:py-32"
    >
      {/* Soft glows behind the list (decoration only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-48 top-1/3 size-[560px] rounded-full bg-accent/10 blur-[150px]" />
        <div className="absolute -right-56 bottom-0 size-[520px] rounded-full bg-dusk/10 blur-[150px]" />
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-8">
        {/* Left: heading and phone button (stays in view while the list scrolls on wide screens) */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
            <span className="h-px w-8 bg-accent" />
            FAQs
          </p>
          <h2
            id="faq-heading"
            className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]"
          >
            Questions,{' '}
            <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
              answered.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
            Everything you need to know before you book. Can&apos;t find your answer? Give us a call and we&apos;ll
            help.
          </p>
          <a
            href={COMPANY.phoneLink}
            className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={2} />
            {COMPANY.phoneDisplay}
          </a>
        </div>

        {/* Right: the questions */}
        <div className="space-y-3 sm:space-y-4">
          {faqsQuery.data.map((faq) => (
            <FaqItem key={faq.id} faq={faq} isOpen={openFaqId === faq.id} onToggle={() => toggleFaq(faq.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}
