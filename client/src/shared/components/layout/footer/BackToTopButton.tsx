import { ArrowUp } from 'lucide-react'

// "Back to top" button in the footer's bottom row. The scroll is smooth unless the visitor
// prefers less motion (that rule lives on `html` in index.css).
export function BackToTopButton() {
  function scrollToTop(): void {
    window.scrollTo({ top: 0 })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-3 text-sm font-medium text-white/60 transition-colors hover:text-white"
    >
      Back to top
      <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 transition duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
        <ArrowUp
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      </span>
    </button>
  )
}
