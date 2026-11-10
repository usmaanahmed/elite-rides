import { CarFront } from 'lucide-react'

type VehiclePhotoProps = {
  name: string
  // null when the vehicle has no photo yet
  imageUrl: string | null
  className?: string
}

// The vehicle's photo on a soft "showroom" background: a light glow behind the car
// and a shadow on the floor under it. Shows a car icon when there is no photo.
export function VehiclePhoto({ name, imageUrl, className = '' }: VehiclePhotoProps) {
  return (
    <div className={`relative overflow-hidden bg-linear-to-b from-surface-muted to-surface ${className}`}>
      {/* Orange glow behind the car */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 bottom-0 h-2/3 rounded-full bg-accent/10 blur-2xl"
      />
      {/* Shadow on the "floor" under the car */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[12%] left-1/2 h-3 w-3/5 -translate-x-1/2 rounded-full bg-black/15 blur-md dark:bg-black/60"
      />

      {imageUrl ? (
        // object-contain keeps the whole car in view, so it never gets cropped
        <img
          src={imageUrl}
          alt={name}
          className="relative size-full object-contain p-4 transition-transform duration-500 group-hover:scale-104"
        />
      ) : (
        <div className="relative grid size-full place-items-center text-accent">
          <CarFront className="size-14" strokeWidth={1.25} />
        </div>
      )}
    </div>
  )
}
