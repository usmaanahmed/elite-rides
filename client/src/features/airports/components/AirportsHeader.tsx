// Top of the airports section: small "Airport transfers" label, the big heading and a short intro.
// Wide screens: heading on the left, intro on the right. Phones: one under the other.
export function AirportsHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
      <div>
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
          <span className="h-px w-8 bg-accent" />
          Airport transfers
        </p>
        <h2
          id="airports-heading"
          className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
        >
          Arrive to an Elite Ride,{' '}
          <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
            not
          </span>{' '}
          a queue.
        </h2>
      </div>
    </div>
  )
}
