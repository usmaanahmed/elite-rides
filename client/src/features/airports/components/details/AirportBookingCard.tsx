import { ArrowRight, Check, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { COMPANY } from '../../../../shared/constants/company'
import { AIRPORT_BOOKING_POINTS } from '../../constants/airportBookingPoints'

type AirportBookingCardProps = {
  airportName: string
}

// Card next to the airport details (stays in view while scrolling on wide screens):
// what comes with the transfer, a "Get a fixed price" button to the booking form, and the phone number
export function AirportBookingCard({ airportName }: AirportBookingCardProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-[28px] bg-night-raised p-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.95)] ring-1 ring-white/10 sm:p-8">
      {/* Warm glow in the top corner (decoration only) */}
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 -z-10 size-64 rounded-full bg-accent/20 blur-[80px]"
      />

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">Airport transfer</p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white">
        Travelling via {airportName}?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-white/55">
        Get a fixed price for your pickup or drop-off in seconds.
      </p>

      <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
        {AIRPORT_BOOKING_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm text-white/80">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-bright">
              <Check aria-hidden="true" className="size-3" strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <Link
        to="/#quote"
        className="group mt-8 flex h-12 items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(252,98,3,0.7)] transition hover:bg-accent-bright"
      >
        Get a fixed price
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </Link>

      <a
        href={COMPANY.phoneLink}
        className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white/70 transition-colors hover:text-white"
      >
        <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={2} />
        Or call {COMPANY.phoneDisplay}
      </a>
    </div>
  )
}
