import { Link2Off } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../../../shared/components/buttons/Button'
import { FormField } from '../../../../shared/components/forms/FormField'
import { TextInput } from '../../../../shared/components/inputs/TextInput'
import { Modal } from '../../../../shared/components/modals/Modal'

type LinkDialogProps = {
  // The link already at the cursor ('' = no link yet)
  initialUrl: string
  initialOpenInNewTab: boolean
  onSave: (url: string, openInNewTab: boolean) => void
  onRemove: () => void
  onClose: () => void
}

const FORM_ID = 'editor-link-form'

// Adds "https://" when the admin types an address without it, e.g. "elite-rides.com"
function addHttps(url: string): string {
  const startsWithKnownPart =
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    url.startsWith('/') ||
    url.startsWith('#')

  if (startsWithKnownPart) {
    return url
  }
  return 'https://' + url
}

// Dialog to add, change or remove a link on the selected text
export function LinkDialog({ initialUrl, initialOpenInNewTab, onSave, onRemove, onClose }: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl)
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab)
  const [error, setError] = useState('')

  const isEditingLink = initialUrl !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // This dialog sits inside the blog form, so stop the submit from also saving the blog
    event.stopPropagation()

    const trimmedUrl = url.trim()
    if (trimmedUrl === '') {
      setError('Enter a web address')
      return
    }
    onSave(addHttps(trimmedUrl), openInNewTab)
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditingLink ? 'Edit link' : 'Add link'}
      size="small"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div>
            {isEditingLink && (
              <Button variant="ghost" icon={Link2Off} onClick={onRemove}>
                Remove link
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID}>
              {isEditingLink ? 'Update link' : 'Add link'}
            </Button>
          </div>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField label="Web address" htmlFor="editorLinkUrl" error={error}>
          <TextInput
            id="editorLinkUrl"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
              setError('')
            }}
            placeholder="e.g. https://www.example.com/page"
            autoComplete="off"
            hasError={error !== ''}
          />
        </FormField>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={openInNewTab}
            onChange={(event) => setOpenInNewTab(event.target.checked)}
            className="size-4 cursor-pointer accent-accent"
          />
          Open in a new tab
        </label>
      </form>
    </Modal>
  )
}
