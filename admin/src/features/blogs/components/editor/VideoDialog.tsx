import { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import { useState, type FormEvent } from 'react'
import { Button } from '../../../../shared/components/buttons/Button'
import { FormField } from '../../../../shared/components/forms/FormField'
import { TextInput } from '../../../../shared/components/inputs/TextInput'
import { Modal } from '../../../../shared/components/modals/Modal'

type VideoDialogProps = {
  onInsert: (youtubeUrl: string) => void
  onClose: () => void
}

const FORM_ID = 'editor-video-form'

// Dialog to put a YouTube video into the blog
export function VideoDialog({ onInsert, onClose }: VideoDialogProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // This dialog sits inside the blog form, so stop the submit from also saving the blog
    event.stopPropagation()

    const trimmedUrl = url.trim()
    if (!isValidYoutubeUrl(trimmedUrl)) {
      setError('Paste a YouTube video link, e.g. https://www.youtube.com/watch?v=…')
      return
    }
    onInsert(trimmedUrl)
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add YouTube video"
      size="small"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            Insert video
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
        <FormField label="YouTube link" htmlFor="editorVideoUrl" error={error}>
          <TextInput
            id="editorVideoUrl"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
              setError('')
            }}
            placeholder="https://www.youtube.com/watch?v=…"
            autoComplete="off"
            hasError={error !== ''}
          />
        </FormField>
      </form>
    </Modal>
  )
}
