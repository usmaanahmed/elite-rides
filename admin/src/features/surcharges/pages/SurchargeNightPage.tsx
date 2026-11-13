import { MoonStar, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { SurchargeNightModal } from '../components/SurchargeNightModal'
import { SurchargeNightTable } from '../components/SurchargeNightTable'
import { useDeleteSurchargeNight, useSurchargeNights } from '../hooks/useSurchargeNight'
import type { SurchargeNight } from '../types/surchargeNight'
import { formatSurchargeAmount } from '../utils/formatSurchargeAmount'

// Text like "22:00 – 06:00" used in messages
function formatNightWindow(surcharge: SurchargeNight): string {
  return `${surcharge.startTime} – ${surcharge.endTime}`
}

export function SurchargeNightPage() {
  // The night surcharges from the server (React Query keeps it cached and up to date)
  const surchargesQuery = useSurchargeNights()
  const deleteMutation = useDeleteSurchargeNight()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The surcharge open in the modal for editing (null = the modal adds a new one)
  const [surchargeToEdit, setSurchargeToEdit] = useState<SurchargeNight | null>(null)
  // The surcharge waiting for the user to confirm its deletion (null = no dialog)
  const [surchargeToDelete, setSurchargeToDelete] = useState<SurchargeNight | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setSurchargeToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(surcharge: SurchargeNight) {
    setSuccessMessage(null)
    setSurchargeToEdit(surcharge)
    setIsModalOpen(true)
  }

  function handleSurchargeSaved(surcharge: SurchargeNight, wasEdit: boolean) {
    const windowText = formatNightWindow(surcharge)
    if (wasEdit) {
      setSuccessMessage(`Night surcharge ${windowText} was updated`)
    } else {
      setSuccessMessage(
        `${formatSurchargeAmount(surcharge.amountType, surcharge.amount)} night surcharge added for ${windowText}`,
      )
    }
  }

  function openDeleteDialog(surcharge: SurchargeNight) {
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
      setSuccessMessage(`Night surcharge ${formatNightWindow(surchargeToDelete)} was deleted`)
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
            title="Night surcharges could not be loaded"
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
          icon={MoonStar}
          title="No night surcharges yet"
          description="Add a night window, such as 22:00 to 06:00, to charge extra for late pickups."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add night surcharge
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <SurchargeNightTable surcharges={surchargesQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Surcharge Night"
        description="Extra charges added to bookings whose pickup time falls in a night window."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add night surcharge
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderSurcharges()}

      <SurchargeNightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        surchargeToEdit={surchargeToEdit}
        onSaved={handleSurchargeSaved}
      />

      <ConfirmDeleteModal
        isOpen={surchargeToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete night surcharge?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          The night surcharge for{' '}
          <span className="font-semibold text-ink">
            {surchargeToDelete ? formatNightWindow(surchargeToDelete) : ''}
          </span>{' '}
          will be removed. To keep it but stop charging it, set its status to Inactive instead.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
