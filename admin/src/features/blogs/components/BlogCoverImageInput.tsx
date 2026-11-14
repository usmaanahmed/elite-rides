import { RefreshCw, Trash2 } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { ImageUpload } from '../../../shared/components/inputs/ImageUpload'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../schemas/blogFormSchema'

type BlogCoverImageInputProps = {
  id: string
  // The saved cover image's link (null = none)
  existingUrl: string | null
  // A newly picked image, not uploaded yet
  newFile: File | null
  onRemoveExisting: () => void
  onNewFileChange: (file: File | null) => void
  hasError?: boolean
}

const IMAGE_HINT = `JPG, PNG or WEBP · up to ${MAX_IMAGE_SIZE_MB} MB · 1200 × 630 px works best`

// Shows the blog's cover image and lets the admin change or remove it
export function BlogCoverImageInput({
  id,
  existingUrl,
  newFile,
  onRemoveExisting,
  onNewFileChange,
  hasError = false,
}: BlogCoverImageInputProps) {
  // Used by the "Change" button of a saved cover
  function handleFilePicked(event: ChangeEvent<HTMLInputElement>) {
    const pickedFile = event.target.files?.[0]
    if (pickedFile) {
      onNewFileChange(pickedFile)
    }
    // Clear the input so picking the same file again still fires a change
    event.target.value = ''
  }

  // A saved cover and nothing new picked: show the saved image with Change / Remove buttons
  if (existingUrl && !newFile) {
    return (
      <div className="overflow-hidden rounded-xl border border-line">
        <input
          id={id}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleFilePicked}
          className="peer sr-only"
        />
        <img src={existingUrl} alt="Blog cover" className="aspect-[1.91/1] w-full bg-surface-muted object-cover" />
        <div className="flex items-center justify-end gap-1 border-t border-line bg-surface px-2 py-2">
          <label
            htmlFor={id}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-nav-hover hover:text-ink"
          >
            <RefreshCw className="size-4" strokeWidth={2} />
            Change
          </label>
          <button
            type="button"
            onClick={onRemoveExisting}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-danger-soft hover:text-danger"
          >
            <Trash2 className="size-4" strokeWidth={2} />
            Remove
          </button>
        </div>
      </div>
    )
  }

  // No saved cover (or a new one picked): the normal click-or-drag picker
  return (
    <ImageUpload
      id={id}
      value={newFile}
      onChange={onNewFileChange}
      hasError={hasError}
      accept={ALLOWED_IMAGE_TYPES.join(',')}
      hint={IMAGE_HINT}
    />
  )
}
