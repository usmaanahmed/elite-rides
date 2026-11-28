import { Plus } from 'lucide-react'
import type { PublicFaq } from '../types/faq'

type FaqItemProps = {
  faq: PublicFaq
  isOpen: boolean
  // Called when the visitor clicks the question (opens it, or closes it if already open)
  onToggle: () => void
}

// One question row. The plus icon on the right turns into a cross when the answer is open.
export function FaqItem({ faq, isOpen, onToggle }: FaqItemProps) {
  const answerId = `faq-answer-${faq.id}`

  // Open row gets a soft orange tint so it stands out from the closed ones
  let rowClasses = 'border-white/10 bg-white/3 hover:border-white/20'
  if (isOpen) {
    rowClasses = 'border-accent/40 bg-accent/6'
  }

  // The plus icon spins into a cross, and fills with orange while open
  let iconBoxClasses = 'border-white/15 text-white/70'
  let iconRotation = ''
  if (isOpen) {
    iconBoxClasses = 'border-accent bg-accent text-white'
    iconRotation = 'rotate-45'
  }

  // The answer slides open by animating its row height from 0 to its full size
  let answerRowClasses = 'grid-rows-[0fr]'
  if (isOpen) {
    answerRowClasses = 'grid-rows-[1fr]'
  }

  return (
    <div className={`rounded-3xl border transition-colors duration-300 ${rowClasses}`}>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={answerId}
          className="flex w-full items-center justify-between gap-5 rounded-3xl px-6 py-5 text-left sm:px-7 sm:py-6"
        >
          <span className="text-base font-semibold leading-snug text-white sm:text-lg">{faq.question}</span>
          <span
            aria-hidden="true"
            className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${iconBoxClasses}`}
          >
            <Plus className={`size-5 transition-transform duration-300 ${iconRotation}`} strokeWidth={2} />
          </span>
        </button>
      </h3>

      <div id={answerId} className={`grid transition-[grid-template-rows] duration-300 ease-out ${answerRowClasses}`}>
        <div className="overflow-hidden">
          <p className="whitespace-pre-line px-6 pb-6 pr-20 text-sm leading-relaxed text-white/65 sm:px-7 sm:pb-7 sm:text-base">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  )
}
