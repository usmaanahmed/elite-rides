import { Images, MapPinned } from 'lucide-react'
import { useState } from 'react'
import { AirportGalleryTile } from '../../airports/components/details/AirportGalleryTile'
import { AirportPhotoViewer } from '../../airports/components/details/AirportPhotoViewer'
import { getGalleryTileClasses } from '../../airports/utils/getGalleryTileClasses'
import type { PublicTour } from '../types/tour'

type TourGalleryProps = {
  tour: PublicTour
}

// Shown in place of the gallery when the office hasn't added photos for this tour yet
function TourGalleryEmpty() {
  return (
    <div className="relative isolate grid h-72 place-items-center overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/10 sm:h-96 lg:h-[460px]">
      <div aria-hidden="true" className="map-grid absolute inset-0 -z-10" />
      <div className="flex flex-col items-center text-center">
        <MapPinned aria-hidden="true" className="size-20 text-white/15 sm:size-24" strokeWidth={1} />
        <p className="mt-4 text-sm font-medium text-white/45">Photos of this tour are coming soon</p>
      </div>
    </div>
  )
}

// Photos of the tour. It uses the same tiles and full-screen viewer as the airport gallery.
// Wide screens: a grid with the first photo big and the others around it.
// Phones and tablets: a row of photos you can swipe sideways. Clicking a photo opens it full screen.
export function TourGallery({ tour }: TourGalleryProps) {
  // Which photo is open full screen. -1 = the viewer is closed.
  const [openPhotoIndex, setOpenPhotoIndex] = useState(-1)
  const imageCount = tour.imageUrls.length

  if (imageCount === 0) {
    return <TourGalleryEmpty />
  }

  // On phones one photo fills the width; with more photos the next one peeks in from the side
  let mobileWidth = 'w-full'
  if (imageCount > 1) {
    mobileWidth = 'w-[85%] sm:w-[62%]'
  }

  return (
    <div className="relative">
      <ul
        aria-label={`Photos of ${tour.title}`}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:h-[min(560px,64svh)] lg:grid-cols-4 lg:grid-rows-2 lg:gap-2 lg:overflow-hidden lg:rounded-[28px] lg:px-0"
      >
        {tour.imageUrls.map((imageUrl, index) => (
          <li
            key={imageUrl}
            className={`shrink-0 snap-start lg:w-auto ${mobileWidth} ${getGalleryTileClasses(index, imageCount)}`}
          >
            <AirportGalleryTile
              imageUrl={imageUrl}
              airportName={tour.title}
              photoNumber={index + 1}
              imageCount={imageCount}
              onOpen={() => setOpenPhotoIndex(index)}
            />
          </li>
        ))}
      </ul>

      {imageCount > 1 && (
        <>
          {/* Wide screens: button on the gallery that opens all photos */}
          <button
            type="button"
            onClick={() => setOpenPhotoIndex(0)}
            className="absolute bottom-5 right-5 hidden h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] transition hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 lg:inline-flex"
          >
            <Images aria-hidden="true" className="size-4" strokeWidth={2} />
            View all {imageCount} photos
          </button>

          {/* Phones: hint that the row can be swiped */}
          <p className="mt-3 text-xs text-white/45 lg:hidden">Swipe to see all {imageCount} photos, tap one to enlarge</p>
        </>
      )}

      {openPhotoIndex !== -1 && (
        <AirportPhotoViewer
          imageUrls={tour.imageUrls}
          airportName={tour.title}
          startIndex={openPhotoIndex}
          onClose={() => setOpenPhotoIndex(-1)}
        />
      )}
    </div>
  )
}
