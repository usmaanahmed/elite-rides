import { useState, type FormEvent } from 'react'
import { Button } from '../../../../shared/components/buttons/Button'
import { Alert } from '../../../../shared/components/feedback/Alert'
import { FormField } from '../../../../shared/components/forms/FormField'
import { ImageUpload } from '../../../../shared/components/inputs/ImageUpload'
import { SegmentedControl } from '../../../../shared/components/inputs/SegmentedControl'
import { TextInput } from '../../../../shared/components/inputs/TextInput'
import { Modal } from '../../../../shared/components/modals/Modal'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../schemas/blogFormSchema'
import { getImageProblem } from '../../utils/getImageProblem'

type ImageDialogProps = {
  // Puts the image into the text
  onInsert: (src: string, altText: string) => void
  // Uploads a picked file and gives back its link
  onUploadImage: (file: File) => Promise<string>
  onClose: () => void
}

// Where the image comes from
type ImageSource = 'upload' | 'link'

const SOURCE_OPTIONS = [
  { value: 'upload', label: 'Upload' },
  { value: 'link', label: 'From a link' },
]

const FORM_ID = 'editor-image-form'

// Dialog to add an image to the blog: upload one from the computer or use an image link
export function ImageDialog({ onInsert, onUploadImage, onClose }: ImageDialogProps) {
  const [source, setSource] = useState<ImageSource>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState('')
  const [altText, setAltText] = useState('')
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  function handleClose() {
    // Don't close halfway through an upload
    if (isUploading) return
    onClose()
  }

  async function insertUploadedImage() {
    if (!file) {
      setError('Choose an image to upload')
      return
    }

    const problem = getImageProblem(file)
    if (problem !== '') {
      setError(problem)
      return
    }

    setIsUploading(true)
    try {
      const uploadedUrl = await onUploadImage(file)
      onInsert(uploadedUrl, altText.trim())
    } catch (uploadError) {
      let message = 'The image could not be uploaded. Please try again.'
      if (uploadError instanceof Error && uploadError.message) {
        message = uploadError.message
      }
      setError(message)
      setIsUploading(false)
    }
  }

  function insertLinkedImage() {
    const trimmedLink = imageLink.trim()
    if (!trimmedLink.startsWith('https://') && !trimmedLink.startsWith('http://')) {
      setError('Enter an image link starting with https://')
      return
    }
    onInsert(trimmedLink, altText.trim())
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // This dialog sits inside the blog form, so stop the submit from also saving the blog
    event.stopPropagation()
    setError('')

    if (source === 'upload') {
      insertUploadedImage()
    } else {
      insertLinkedImage()
    }
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title="Add image"
      description="Tip: you can also drag images into the editor or paste them."
      size="small"
      closeOnBackdropClick={!isUploading}
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={isUploading}>
            {isUploading ? 'Uploading…' : 'Insert image'}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-5">
        {error !== '' && <Alert variant="error" title={error} />}

        <SegmentedControl
          label="Image source"
          options={SOURCE_OPTIONS}
          value={source}
          onChange={(value) => {
            setSource(value as ImageSource)
            setError('')
          }}
          className="w-full"
        />

        {source === 'upload' ? (
          <ImageUpload
            id="editorImageFile"
            value={file}
            onChange={(pickedFile) => {
              setFile(pickedFile)
              setError('')
            }}
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            hint={`JPG, PNG or WEBP · up to ${MAX_IMAGE_SIZE_MB} MB`}
          />
        ) : (
          <FormField label="Image link" htmlFor="editorImageLink">
            <TextInput
              id="editorImageLink"
              value={imageLink}
              onChange={(event) => setImageLink(event.target.value)}
              placeholder="https://www.example.com/photo.jpg"
              autoComplete="off"
            />
          </FormField>
        )}

        <FormField
          label="Alt text"
          htmlFor="editorImageAlt"
          isOptional
          hint="Describes the image for Google and for people using screen readers."
        >
          <TextInput
            id="editorImageAlt"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="e.g. Chauffeur opening the car door at Heathrow"
            maxLength={200}
            autoComplete="off"
          />
        </FormField>
      </form>
    </Modal>
  )
}
