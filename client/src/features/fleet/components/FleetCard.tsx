import { ArrowRight } from 'lucide-react'
import { getFileUrl } from '../../../shared/api/apiUrl'
import type { PublicVehicle } from '../../booking/types/publicApi'
import { FleetCardSpecs } from './FleetCardSpecs'

type FleetCardProps = {
  vehicle: PublicVehicle
}

// One vehicle in the fleet carousel. The vehicle photo (a transparent PNG) sits on top of a dark
// card panel, and the panel slides up under the bottom part of the photo, so the vehicle looks
// like it is breaking out of the card. Under it: name, description, capacity and "Get a quote".
// On hover the vehicle rises further out of the card, the card lifts a little and glows orange.
export function FleetCard({ vehicle }: FleetCardProps) {
  return (
    <article className="group relative flex h-full flex-col">
      {/*
        Vehicle photo, on top of the panel (z-10). 4:3 box, the vehicle sits on its bottom edge.
        The image is `absolute` so its own size can't stretch the box: every card's box is exactly
        the same height, so all the panels line up.
        Shadow: drop-shadow follows the vehicle's own shape (not a box). It is moved down more than it
        is blurred, so the vehicle hides most of it and only a thin shadow shows underneath, like a real
        shadow on the ground. On hover that shadow gets a very faint brand-orange tint (#fc6203).
        `transition` animates the change smoothly.
      */}
      <div className="relative z-10 aspect-4/3 transition-transform duration-700 ease-out group-hover:-translate-y-2">
        <img
          src={getFileUrl(vehicle.imageUrl)}
          alt={vehicle.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_12px_8px_rgba(0,0,0,0.55)] transition duration-700 ease-out group-hover:scale-[1.04] group-hover:drop-shadow-[0_10px_6px_rgba(252,98,3,0.18)]"
        />
      </div>

      {/*
        Card panel. mt-[-35%] pulls it up under the lower part of the photo, and pt-[calc(35%+1rem)]
        pushes the text back down below the photo. (Both 35% values are 35% of the card's width,
        so they always match. Change them together, also in FleetSkeleton.)
      */}
      <div className="relative mt-[-35%] flex flex-1 flex-col rounded-[28px] bg-night-raised px-6 pb-5 pt-[calc(35%+1rem)] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-30px_rgba(252,98,3,0.45)] group-hover:ring-white/20 has-focus-visible:ring-2 has-focus-visible:ring-accent">
        {/* Soft white light at the top of the panel, like a spotlight under the vehicle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-2/3 rounded-t-[28px] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.09),transparent_70%)]"
        />
        {/* Warm orange glow that fades in on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-2/3 rounded-t-[28px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(252,98,3,0.2),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <h3 className="relative text-2xl font-semibold tracking-tight text-white">{vehicle.name}</h3>
        {vehicle.description && (
          <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">{vehicle.description}</p>
        )}

        {/* mt-auto pushes this to the bottom, so capacity and links line up across all cards */}
        <div className="relative mt-auto pt-6">
          <FleetCardSpecs vehicle={vehicle} />

          <a
            href="#quote"
            className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-white focus-visible:outline-none"
          >
            <span>
              Get a quote
              <span className="sr-only"> for the {vehicle.name}</span>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-white/6 ring-1 ring-white/10 transition duration-500 group-hover:bg-accent group-hover:ring-accent">
              <ArrowRight
                aria-hidden="true"
                className="size-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
                strokeWidth={2}
              />
            </span>
          </a>
        </div>
      </div>
    </article>
  )
}
