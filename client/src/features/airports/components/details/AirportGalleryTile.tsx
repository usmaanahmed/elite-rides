import { Expand } from 'lucide-react'
import { getFileUrl } from '../../../../shared/api/apiUrl'

type AirportGalleryTileProps = {
  imageUrl: string
  airportName: string
  // 1 = first photo
  photoNumber: number
  imageCount: number
  onOpen: () => void
}

// One photo in the airport gallery. It is a button: clicking it opens the photo full screen.
// On hover the photo zooms in slowly and an "enlarge" icon appears.
export function AirportGalleryTile({ imageUrl, airportName, photoNumber, imageCount, onOpen }: AirportGalleryTileProps) {
  // The first photo is at the top of the page, so load it straight away; the others when needed
  let loading: 'eager' | 'lazy' = 'lazy'
  if (photoNumber === 1) {
    loading = 'eager'
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block aspect-4/3 w-full overflow-hidden rounded-2xl bg-night-raised ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent lg:aspect-auto lg:h-full lg:rounded-none lg:ring-0"
    >
      <img
        src={getFileUrl(imageUrl)}
        alt={`${airportName}, photo ${photoNumber} of ${imageCount}`}
        loading={loading}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />
      {/* Slight darkening on hover, so the white icon stands out */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-night/0 transition-colors duration-500 group-hover:bg-night/20"
      />
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 grid size-10 scale-90 place-items-center rounded-full bg-night/50 text-white opacity-0 ring-1 ring-white/20 backdrop-blur-md transition duration-500 group-hover:scale-100 group-hover:opacity-100"
      >
        <Expand className="size-4" strokeWidth={2} />
      </span>
    </button>
  )
}
