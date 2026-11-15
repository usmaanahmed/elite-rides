import { Images } from 'lucide-react'
import { useState } from 'react'
import type { PublicAirport } from '../../types/airport'
import { getGalleryTileClasses } from '../../utils/getGalleryTileClasses'
import { AirportGalleryEmpty } from './AirportGalleryEmpty'
import { AirportGalleryTile } from './AirportGalleryTile'
import { AirportPhotoViewer } from './AirportPhotoViewer'

type AirportGalleryProps = {
  airport: PublicAirport
}

// Photos of the airport.
// Wide screens: a grid with the first photo big and the others around it (see getGalleryTileClasses).
// Phones and tablets: a row of photos you can swipe sideways.
// Clicking any photo opens it full screen (AirportPhotoViewer).
export function AirportGallery({ airport }: AirportGalleryProps) {
  // Which photo is open full screen. -1 = the viewer is closed.
  const [openPhotoIndex, setOpenPhotoIndex] = useState(-1)
  const imageCount = airport.imageUrls.length

  function openViewer(photoIndex: number): void {
    setOpenPhotoIndex(photoIndex)
  }

  function closeViewer(): void {
    setOpenPhotoIndex(-1)
  }

  if (imageCount === 0) {
    return <AirportGalleryEmpty />
  }

  // On phones one photo fills the width; with more photos the next one peeks in from the side
  let mobileWidth = 'w-full'
  if (imageCount > 1) {
    mobileWidth = 'w-[85%] sm:w-[62%]'
  }

  return (
    <div className="relative">
      {/*
        -mx / px = the swipe row runs to the screen edges on phones, but starts in line with the page.
        From `lg` it becomes the 4 x 2 grid, with rounded corners on the outside only.
      */}
      <ul
        aria-label={`Photos of ${airport.name}`}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:h-[min(560px,64svh)] lg:grid-cols-4 lg:grid-rows-2 lg:gap-2 lg:overflow-hidden lg:rounded-[28px] lg:px-0"
      >
        {airport.imageUrls.map((imageUrl, index) => (
          <li
            key={imageUrl}
            className={`shrink-0 snap-start lg:w-auto ${mobileWidth} ${getGalleryTileClasses(index, imageCount)}`}
          >
            <AirportGalleryTile
              imageUrl={imageUrl}
              airportName={airport.name}
              photoNumber={index + 1}
              imageCount={imageCount}
              onOpen={() => openViewer(index)}
            />
          </li>
        ))}
      </ul>

      {imageCount > 1 && (
        <>
          {/* Wide screens: button on the gallery that opens all photos */}
          <button
            type="button"
            onClick={() => openViewer(0)}
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
          imageUrls={airport.imageUrls}
          airportName={airport.name}
          startIndex={openPhotoIndex}
          onClose={closeViewer}
        />
      )}
    </div>
  )
}
