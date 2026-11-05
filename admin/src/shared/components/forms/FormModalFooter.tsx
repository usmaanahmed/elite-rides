import { RotateCcw } from 'lucide-react'
import { Button } from '../buttons/Button'

type FormModalFooterProps = {
  // Id of the <form> the Save button submits (the footer sits outside the form)
  formId: string
  // e.g. "Save vehicle"
  submitLabel: string
  isSubmitting: boolean
  // False when there is nothing to reset, e.g. the form is still empty
  canReset: boolean
  onReset: () => void
  onCancel: () => void
}

// The Reset / Cancel / Save row shown at the bottom of every form modal
export function FormModalFooter({
  formId,
  submitLabel,
  isSubmitting,
  canReset,
  onReset,
  onCancel,
}: FormModalFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="ghost" icon={RotateCcw} onClick={onReset} disabled={!canReset || isSubmitting}>
        Reset
      </Button>
      <div className="flex items-center gap-2.5">
        {/* Phones already have the close button at the top, so Cancel is hidden there to save room */}
        <div className="hidden sm:block">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
        <Button type="submit" form={formId} isLoading={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </div>
  )
}
