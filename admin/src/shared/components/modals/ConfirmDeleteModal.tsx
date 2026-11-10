import { Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../buttons/Button'
import { Alert } from '../feedback/Alert'
import { Modal } from './Modal'

type ConfirmDeleteModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  // e.g. "Delete address?"
  title: string
  // The explanation shown in the dialog
  children: ReactNode
  isDeleting: boolean
  // Shown as a red alert when the delete failed (null = no error)
  errorMessage: string | null
  // Text of the red button, e.g. "Delete" or "Delete all"
  confirmLabel?: string
}

// A "Are you sure?" dialog used before deleting something
export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  isDeleting,
  errorMessage,
  confirmLabel = 'Delete',
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button icon={Trash2} onClick={onConfirm} isLoading={isDeleting}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="text-sm text-muted">{children}</div>
        {errorMessage && <Alert variant="error" title="Could not delete" description={errorMessage} />}
      </div>
    </Modal>
  )
}
