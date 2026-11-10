import { CircleAlert } from 'lucide-react'
import { Button } from '../buttons/Button'
import { Modal } from './Modal'

export type ImportRowError = {
  row: number
  message: string
}

type ImportResultModalProps = {
  isOpen: boolean
  onClose: () => void
  addedCount: number
  errors: ImportRowError[]
  // e.g. "address" or "fixed price", used in the summary text
  itemLabel: string
}

// Shows what happened after a CSV import: how many rows were added, and which
// rows were skipped and why. Used after any "Import CSV" button in the app.
export function ImportResultModal({ isOpen, onClose, addedCount, errors, itemLabel }: ImportResultModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import finished"
      size="small"
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-ink">
          <span className="font-semibold">
            {addedCount} {itemLabel}
            {addedCount === 1 ? '' : 's'}
          </span>{' '}
          imported successfully.
        </p>

        {errors.length > 0 && (
          <div>
            <p className="text-sm font-medium text-ink">
              {errors.length} row{errors.length === 1 ? '' : 's'} could not be imported:
            </p>
            <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto">
              {errors.map((error) => (
                <li key={error.row} className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                  <span>
                    Row {error.row}: {error.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  )
}
