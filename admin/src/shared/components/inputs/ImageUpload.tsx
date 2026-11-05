import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react'
import { useState, type ChangeEvent, type DragEvent, type Ref } from 'react'
import { useImagePreview } from '../../hooks/useImagePreview'
import { formatFileSize } from '../../utils/formatFileSize'

type ImageUploadProps = {
  id: string
  value: File | null
  onChange: (file: File | null) => void
  // Called after a file is picked or removed, so the form knows the field was "touched"
  onBlur?: () => void
  hasError?: boolean
  // Which file types the file picker offers, e.g. "image/png,image/jpeg"
  accept?: string
  // Grey text in the drop area, e.g. "JPG, PNG or WEBP · up to 2 MB"
  hint?: string
  // Lets React Hook Form focus this field when it has an error
  ref?: Ref<HTMLInputElement>
}

// Click-or-drag image picker with a preview of the chosen image.
// It does not check the file itself; the form's validation decides what is allowed.
export function ImageUpload({
  id,
  value,
  onChange,
  onBlur,
  hasError = false,
  accept = 'image/*',
  hint,
  ref,
}: ImageUploadProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const previewUrl = useImagePreview(value)

  function selectFile(file: File | null) {
    onChange(file)
    onBlur?.()
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const pickedFile = event.target.files?.[0]
    // Nothing picked means the user cancelled the file picker, so keep the current image
    if (pickedFile) selectFile(pickedFile)
    // Clear the input so picking the same file again still fires a change
    event.target.value = ''
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    // Without preventDefault the browser would open the dropped file in the tab
    event.preventDefault()
    setIsDraggingOver(true)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) selectFile(droppedFile)
  }

  let dropZoneClasses = 'border-line bg-surface-muted hover:border-accent/50 peer-focus-visible:border-accent/50 peer-focus-visible:ring-accent/10'
  if (hasError) dropZoneClasses = 'border-danger/70 bg-danger-soft peer-focus-visible:ring-danger/10'
  if (isDraggingOver) dropZoneClasses = 'border-accent bg-accent-soft'

  return (
    <div onDragOver={handleDragOver} onDragLeave={() => setIsDraggingOver(false)} onDrop={handleDrop}>
      {/* The real file input is visually hidden; the labels below open it when clicked.
          `peer` lets the drop area show a focus ring when the input is focused with the keyboard. */}
      <input
        ref={ref}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className="peer sr-only"
      />

      {value ? (
        <div className={`overflow-hidden rounded-xl border ${hasError ? 'border-danger/70' : 'border-line'} ${isDraggingOver ? 'ring-4 ring-accent/15' : ''}`}>
          <div className="grid h-44 place-items-center bg-surface-muted p-3">
            {previewUrl && <img src={previewUrl} alt="Selected image preview" className="max-h-full max-w-full object-contain" />}
          </div>

          <div className="flex items-center gap-3 border-t border-line bg-surface px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{value.name}</p>
              <p className="text-xs text-muted">{formatFileSize(value.size)}</p>
            </div>
            <label
              htmlFor={id}
              title="Choose a different image"
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-nav-hover hover:text-ink"
            >
              <RefreshCw className="size-4" strokeWidth={2} />
              <span className="hidden sm:inline">Change</span>
            </label>
            <button
              type="button"
              onClick={() => selectFile(null)}
              aria-label="Remove image"
              title="Remove image"
              className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-danger-soft hover:text-danger"
            >
              <Trash2 className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-all peer-focus-visible:ring-4 ${dropZoneClasses}`}
        >
          <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
            <ImagePlus className="size-5" strokeWidth={1.75} />
          </span>
          <span className="mt-3 text-sm text-muted">
            <span className="font-semibold text-accent-ink">Click to upload</span> or drag and drop
          </span>
          {hint && <span className="mt-1 text-xs text-muted">{hint}</span>}
        </label>
      )}
    </div>
  )
}
