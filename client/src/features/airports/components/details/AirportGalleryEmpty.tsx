import { Plane } from 'lucide-react'

// Shown in place of the gallery when the office hasn't added photos for this airport yet:
// a dark map-style panel with a plane, so the page still looks finished
export function AirportGalleryEmpty() {
  return (
    <div className="relative isolate grid h-72 place-items-center overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/10 sm:h-96 lg:h-[460px]">
      <div aria-hidden="true" className="map-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[110px]"
      />
      <div className="flex flex-col items-center text-center">
        <Plane aria-hidden="true" className="size-20 text-white/15 sm:size-24" strokeWidth={1} />
        <p className="mt-4 text-sm font-medium text-white/45">Photos of this airport are coming soon</p>
      </div>
    </div>
  )
}
