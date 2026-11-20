import { MapPinned, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TourModal } from '../components/TourModal'
import { ToursTable } from '../components/ToursTable'
import { useDeleteTour, useTours } from '../hooks/useTours'
import type { TourItem } from '../types/tour'

// The Tours page: a table of all tours with add, edit and delete
export function ToursPage() {
  // The tours from the server (React Query keeps it cached and up to date)
  const toursQuery = useTours()
  const deleteMutation = useDeleteTour()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The tour open in the modal for editing (null = the modal adds a new tour)
  const [tourToEdit, setTourToEdit] = useState<TourItem | null>(null)
  // The tour waiting for the user to confirm its deletion (null = no dialog)
  const [tourToDelete, setTourToDelete] = useState<TourItem | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setTourToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(tour: TourItem) {
    setSuccessMessage(null)
    setTourToEdit(tour)
    setIsModalOpen(true)
  }

  function handleTourSaved(tour: TourItem, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`"${tour.title}" was updated`)
    } else {
      setSuccessMessage(`"${tour.title}" was added`)
    }
  }

  function openDeleteDialog(tour: TourItem) {
    deleteMutation.reset()
    setTourToDelete(tour)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setTourToDelete(null)
  }

  async function confirmDelete() {
    if (!tourToDelete) return

    try {
      await deleteMutation.mutateAsync(tourToDelete.id)
      setSuccessMessage(`"${tourToDelete.title}" was deleted`)
      setTourToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderTours() {
    if (toursQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (toursQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Tours could not be loaded" description={toursQuery.error.message} />
          <Button variant="secondary" onClick={() => toursQuery.refetch()} isLoading={toursQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (toursQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={MapPinned}
          title="No tours yet"
          description="Add a tour with its photos and a price for each vehicle."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add tour
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-6">
        <ToursTable tours={toursQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Tours"
        description="Tours customers can book on the website, with a price for each vehicle."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add tour
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderTours()}

      <TourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourToEdit={tourToEdit}
        onSaved={handleTourSaved}
      />

      <ConfirmDeleteModal
        isOpen={tourToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete tour?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{tourToDelete?.title}</span> and all its images will be deleted.
          This cannot be undone.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
