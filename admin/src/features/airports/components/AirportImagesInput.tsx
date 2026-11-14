import { ImagePlus, X } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useImagePreview } from '../../../shared/hooks/useImagePreview'
import { formatFileSize } from '../../../shared/utils/formatFileSize'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB, MAX_IMAGES } from '../schemas/airportFormSchema'
import type { AirportImage } from '../types/airport'

type AirportImagesInputProps = {
  id: string
  // Images already saved on the server
  existingImages: AirportImage[]
  // Images picked now, not uploaded yet
  newImages: File[]
  onExistingImagesChange: (images: AirportImage[]) => void
  onNewImagesChange: (files: File[]) => void
  hasError?: boolean
}

const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

// A small box showing a saved image, with a button to remove it
function SavedImageBox({ image, onRemove }: { image: AirportImage; onRemove: () => void }) {
  return (
    <div className="relative">
      <img src={image.url} alt="Airport" className="h-24 w-full rounded-lg border border-line bg-surface-muted object-cover" />
      <RemoveButton onClick={onRemove} />
    </div>
  )
}

// A small box showing a newly picked image, with its size. It turns red if the file is not allowed.
function NewImageBox({ file, onRemove }: { file: File; onRemove: () => void }) {
  const previewUrl = useImagePreview(file)
  const isTooBig = file.size > MAX_IMAGE_SIZE_BYTES
  const isWrongType = !ALLOWED_IMAGE_TYPES.includes(file.type)
  const isInvalid = isTooBig || isWrongType

  return (
    <div className="relative">
      <div
        className={`grid h-24 place-items-center overflow-hidden rounded-lg border bg-surface-muted ${isInvalid ? 'border-danger/70' : 'border-line'}`}
      >
        {previewUrl && <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />}
      </div>
      <p className={`mt-1 truncate text-xs ${isInvalid ? 'font-medium text-danger' : 'text-muted'}`}>
        {formatFileSize(file.size)}
      </p>
      <RemoveButton onClick={onRemove} />
    </div>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove image"
      title="Remove image"
      className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-ink/70 text-white transition-colors hover:bg-danger"
    >
      <X className="size-3.5" strokeWidth={2.5} />
    </button>
  )
}

// Shows the airport's images and lets the admin remove them or pick more (up to MAX_IMAGES in total).
// It does not check the files itself; the form's validation decides what is allowed.
export function AirportImagesInput({
  id,
  existingImages,
  newImages,
  onExistingImagesChange,
  onNewImagesChange,
  hasError = false,
}: AirportImagesInputProps) {
  const totalImages = existingImages.length + newImages.length
  const canAddMore = totalImages < MAX_IMAGES

  function handleFilesPicked(event: ChangeEvent<HTMLInputElement>) {
    const pickedFiles = Array.from(event.target.files ?? [])
    onNewImagesChange([...newImages, ...pickedFiles])
    // Clear the input so picking the same file again still fires a change
    event.target.value = ''
  }

  function removeExistingImage(fileName: string) {
    onExistingImagesChange(existingImages.filter((image) => image.fileName !== fileName))
  }

  function removeNewImage(indexToRemove: number) {
    onNewImagesChange(newImages.filter((_file, index) => index !== indexToRemove))
  }

  return (
    <div>
      <input
        id={id}
        type="file"
        multiple
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleFilesPicked}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className="peer sr-only"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {existingImages.map((image) => (
          <SavedImageBox key={image.fileName} image={image} onRemove={() => removeExistingImage(image.fileName)} />
        ))}

        {newImages.map((file, index) => (
          <NewImageBox key={`${file.name}-${index}`} file={file} onRemove={() => removeNewImage(index)} />
        ))}

        {canAddMore && (
          <label
            htmlFor={id}
            className={`flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-2 text-center text-xs text-muted transition-colors hover:border-accent/50 peer-focus-visible:ring-4 peer-focus-visible:ring-accent/10 ${hasError ? 'border-danger/70 bg-danger-soft' : 'border-line bg-surface-muted'}`}
          >
            <ImagePlus className="mb-1 size-5 text-accent" strokeWidth={1.75} />
            <span className="font-semibold text-accent-ink">Add images</span>
          </label>
        )}
      </div>

      <p className="mt-2 text-xs text-muted">
        JPG, PNG or WEBP · up to {MAX_IMAGE_SIZE_MB} MB each · {totalImages} of {MAX_IMAGES} used
      </p>
    </div>
  )
}
