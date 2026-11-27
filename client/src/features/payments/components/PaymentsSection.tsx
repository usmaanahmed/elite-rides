import { ArrowRight } from 'lucide-react'
import { PaymentLogos } from './PaymentLogos'

// "Easy payment options" section on the home page: heading, short line, the "Book Now" button
// (jumps to the quote form at the top) and the accepted cards. `isolate` keeps the glows inside.
export function PaymentsSection() {
  return (
    <section
      id="payments"
      aria-labelledby="payments-heading"
      className="relative isolate overflow-hidden border-t border-white/10 py-24 sm:py-28 lg:py-32"
    >
      {/* Soft glows behind the content (decoration only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 bottom-0 size-[520px] rounded-full bg-accent/10 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 size-[520px] rounded-full bg-dusk/10 blur-[150px]" />
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
          <span className="h-px w-8 bg-accent" />
          Easy payment
          <span className="h-px w-8 bg-accent" />
        </p>

        <h2
          id="payments-heading"
          className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
        >
          Why not travel in{' '}
          <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
            style
          </span>{' '}
          &amp; comfort with easy payment options?
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/60">
          Book a taxi with us today and experience more than just a transfer. Experience London, with lots of
          easy payment options.
        </p>

        <a
          href="/#quote"
          className="group mt-10 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-[15px] font-semibold text-white shadow-[0_14px_34px_-12px_rgba(252,98,3,0.8)] transition hover:brightness-95"
        >
          Book Now
          <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </a>

        <div className="mt-14">
          <PaymentLogos />
        </div>
      </div>
    </section>
  )
}
