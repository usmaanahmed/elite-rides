// Huge, faded company name in the background of the footer's links section (decoration only).
// It is centred behind the whole section (logo, contact details and link columns) and fades out
// towards the bottom, so the text on top stays easy to read.
// The parent must be `relative isolate`, so `-z-10` keeps it behind the links.
// The size follows the screen width (vw), so the name always fits on one line.
export function FooterWordmark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none overflow-hidden"
    >
      <p className="whitespace-nowrap text-center text-[22vw] font-semibold leading-none tracking-tighter xl:text-[18rem]">
        <span className="bg-linear-to-b from-white/10 via-white/4 to-transparent bg-clip-text text-transparent">Elite</span>{' '}
        <span className="bg-linear-to-b from-accent/30 via-accent/8 to-transparent bg-clip-text pr-[0.06em] font-display font-normal italic tracking-normal text-transparent">
          Rides
        </span>
      </p>
    </div>
  )
}
