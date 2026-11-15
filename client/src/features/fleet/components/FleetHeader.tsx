// Top of the fleet section: small "The fleet" label, the big heading and a short intro.
// Wide screens: heading on the left, intro on the right. Phones: one under the other.
export function FleetHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
      <div>
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
          <span className="h-px w-8 bg-accent" />
          The fleet
        </p>
        <h2
          id="fleet-heading"
          className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
        >
          The{' '}
          <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
            right
          </span>{' '}
          vehicle for every journey.
        </h2>
      </div>

      <p className="max-w-md text-base leading-relaxed text-white/60 lg:pb-2">
        From a quick airport run to a family trip with plenty of luggage, choose the vehicle that fits. Every
        vehicle comes with a professional chauffeur and a fixed fare agreed before you book.
      </p>
    </div>
  )
}
