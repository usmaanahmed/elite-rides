import { CalendarClock, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { SurchargeDateModal } from '../components/SurchargeDateModal'
import { SurchargeDatesTable } from '../components/SurchargeDatesTable'
import { useDeleteSurchargeDate, useSurchargeDates } from '../hooks/useSurchargeDates'
import type { SurchargeDate } from '../types/surchargeDate'
import { formatSurchargeAmount } from '../utils/formatSurchargeAmount'
import { formatSurchargeDate } from '../utils/formatSurchargeDate'

export function SurchargeOnDatePage() {
  // The date surcharges from the server (React Query keeps it cached and up to date)
  const surchargesQuery = useSurchargeDates()
  const deleteMutation = useDeleteSurchargeDate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The surcharge open in the modal for editing (null = the modal adds a new one)
  const [surchargeToEdit, setSurchargeToEdit] = useState<SurchargeDate | null>(null)
  // The surcharge waiting for the user to confirm its deletion (null = no dialog)
  const [surchargeToDelete, setSurchargeToDelete] = useState<SurchargeDate | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setSurchargeToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(surcharge: SurchargeDate) {
    setSuccessMessage(null)
    setSurchargeToEdit(surcharge)
    setIsModalOpen(true)
  }

  function handleSurchargeSaved(surcharge: SurchargeDate, wasEdit: boolean) {
    const dateText = formatSurchargeDate(surcharge.date)
    if (wasEdit) {
      setSuccessMessage(`Surcharge for ${dateText} was updated`)
    } else {
      setSuccessMessage(`${formatSurchargeAmount(surcharge.amountType, surcharge.amount)} surcharge added for ${dateText}`)
    }
  }

  function openDeleteDialog(surcharge: SurchargeDate) {
    deleteMutation.reset()
    setSurchargeToDelete(surcharge)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setSurchargeToDelete(null)
  }

  async function confirmDelete() {
    if (!surchargeToDelete) return

    try {
      await deleteMutation.mutateAsync(surchargeToDelete.id)
      setSuccessMessage(`Surcharge for ${formatSurchargeDate(surchargeToDelete.date)} was deleted`)
      setSurchargeToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderSurcharges() {
    if (surchargesQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (surchargesQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert
            variant="error"
            title="Date surcharges could not be loaded"
            description={surchargesQuery.error.message}
          />
          <Button variant="secondary" onClick={() => surchargesQuery.refetch()} isLoading={surchargesQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (surchargesQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={CalendarClock}
          title="No date surcharges yet"
          description="Add a date, such as a public holiday, to charge extra on it."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add surcharge
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <SurchargeDatesTable surcharges={surchargesQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Surcharge On Date"
        description="Extra charges added for bookings on certain dates."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add surcharge
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderSurcharges()}

      <SurchargeDateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        surchargeToEdit={surchargeToEdit}
        onSaved={handleSurchargeSaved}
      />

      <ConfirmDeleteModal
        isOpen={surchargeToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete date surcharge?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          The surcharge for{' '}
          <span className="font-semibold text-ink">
            {surchargeToDelete ? formatSurchargeDate(surchargeToDelete.date) : ''}
          </span>{' '}
          will be removed. To keep it but stop charging it, set its status to Inactive instead.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
