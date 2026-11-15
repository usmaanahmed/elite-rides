import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type SyntheticEvent } from 'react'
import { getFileUrl } from '../../../../shared/api/apiUrl'
import { formatTwoDigits } from '../../../fleet/utils/formatTwoDigits'

type AirportPhotoViewerProps = {
  imageUrls: string[]
  airportName: string
  // Photo to show first (0 = first photo)
  startIndex: number
  onClose: () => void
}

// Same look for the round buttons on the dark viewer
const roundButtonClasses =
  'grid size-11 place-items-center rounded-full border border-white/15 bg-night/60 text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 sm:size-12'

// Full-screen photo viewer: one big photo, previous / next arrows and small photos at the bottom.
// Keys: ← → change the photo, Esc closes.
// Uses the browser's <dialog> (showModal), which keeps keyboard focus inside the viewer
// and puts it back on the clicked photo when the viewer closes.
export function AirportPhotoViewer({ imageUrls, airportName, startIndex, onClose }: AirportPhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const imageCount = imageUrls.length

  // Open the dialog when the viewer appears, and stop the page behind from scrolling
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      if (dialog && dialog.open) {
        dialog.close()
      }
    }
  }, [])

  function showPreviousPhoto(): void {
    if (currentIndex === 0) {
      setCurrentIndex(imageCount - 1)
    } else {
      setCurrentIndex(currentIndex - 1)
    }
  }

  function showNextPhoto(): void {
    if (currentIndex === imageCount - 1) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Arrow keys change the photo
  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>): void {
    if (event.key === 'ArrowLeft') {
      showPreviousPhoto()
    }
    if (event.key === 'ArrowRight') {
      showNextPhoto()
    }
  }

  // Esc: the browser wants to close the dialog itself; we close it through React instead
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>): void {
    event.preventDefault()
    onClose()
  }

  const hasManyPhotos = imageCount > 1

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Photos of ${airportName}`}
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-night/95 p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-xl"
    >
      <div className="flex h-full flex-col animate-fade-in">
        {/* Top bar: photo counter, airport name, close button */}
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45 tabular-nums">
            <span className="text-white">{formatTwoDigits(currentIndex + 1)}</span> / {formatTwoDigits(imageCount)}
          </p>
          <p className="hidden truncate text-sm font-semibold text-white/80 sm:block">{airportName}</p>
          <button type="button" onClick={onClose} aria-label="Close photos" className={roundButtonClasses}>
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        {/* The big photo (min-h-0 lets it shrink to fit the screen height) */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-24">
          <img
            key={currentIndex}
            src={getFileUrl(imageUrls[currentIndex])}
            alt={`${airportName}, photo ${currentIndex + 1} of ${imageCount}`}
            className="max-h-full max-w-full animate-fade-in rounded-2xl object-contain shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
          />

          {hasManyPhotos && (
            <>
              <button
                type="button"
                onClick={showPreviousPhoto}
                aria-label="Previous photo"
                className={`absolute left-3 top-1/2 -translate-y-1/2 sm:left-6 ${roundButtonClasses}`}
              >
                <ArrowLeft className="size-4.5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={showNextPhoto}
                aria-label="Next photo"
                className={`absolute right-3 top-1/2 -translate-y-1/2 sm:right-6 ${roundButtonClasses}`}
              >
                <ArrowRight className="size-4.5" strokeWidth={2} />
              </button>
            </>
          )}
        </div>

        {/* Small photos at the bottom: the open one is bright with an orange ring */}
        {hasManyPhotos && (
          <ul className="flex justify-center gap-2 overflow-x-auto px-4 py-5 scrollbar-none sm:gap-3">
            {imageUrls.map((imageUrl, index) => (
              <li key={imageUrl} className="shrink-0">
                <ViewerThumbnail
                  imageUrl={imageUrl}
                  photoNumber={index + 1}
                  isCurrent={index === currentIndex}
                  onSelect={() => setCurrentIndex(index)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  )
}

type ViewerThumbnailProps = {
  imageUrl: string
  photoNumber: number
  isCurrent: boolean
  onSelect: () => void
}

// One small photo at the bottom of the viewer; clicking it shows that photo big
function ViewerThumbnail({ imageUrl, photoNumber, isCurrent, onSelect }: ViewerThumbnailProps) {
  let stateClasses = 'opacity-45 ring-1 ring-white/10 hover:opacity-80'
  if (isCurrent) {
    stateClasses = 'opacity-100 ring-2 ring-accent'
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show photo ${photoNumber}`}
      aria-current={isCurrent}
      className={`block h-14 w-20 overflow-hidden rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-16 sm:w-24 ${stateClasses}`}
    >
      <img src={getFileUrl(imageUrl)} alt="" className="h-full w-full object-cover" />
    </button>
  )
}
