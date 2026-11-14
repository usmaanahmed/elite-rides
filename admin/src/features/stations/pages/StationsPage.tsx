import { TrainFront, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { StationFilters } from '../components/StationFilters'
import { StationModal } from '../components/StationModal'
import { StationsTable } from '../components/StationsTable'
import { useStations, useDeleteStation } from '../hooks/useStations'
import type { Station, StationFilterValues } from '../types/station'
import { filterStations } from '../utils/filterStations'

const emptyFilters: StationFilterValues = { name: '', address: '', images: 'all' }

export function StationsPage() {
  // The stations from the server (React Query keeps it cached and up to date)
  const stationsQuery = useStations()
  const deleteMutation = useDeleteStation()

  const [filters, setFilters] = useState<StationFilterValues>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // The station open in the modal for editing (null = the modal adds a new station)
  const [stationToEdit, setStationToEdit] = useState<Station | null>(null)
  // The station waiting for the user to confirm its deletion (null = no dialog)
  const [stationToDelete, setStationToDelete] = useState<Station | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setStationToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(station: Station) {
    setSuccessMessage(null)
    setStationToEdit(station)
    setIsModalOpen(true)
  }

  function handleStationSaved(station: Station, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`"${station.name}" was updated`)
    } else {
      setSuccessMessage(`"${station.name}" was added`)
    }
  }

  function openDeleteDialog(station: Station) {
    deleteMutation.reset()
    setStationToDelete(station)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setStationToDelete(null)
  }

  async function confirmDelete() {
    if (!stationToDelete) return

    try {
      await deleteMutation.mutateAsync(stationToDelete.id)
      setSuccessMessage(`"${stationToDelete.name}" was deleted`)
      setStationToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderStations() {
    if (stationsQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (stationsQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Stations could not be loaded" description={stationsQuery.error.message} />
          <Button variant="secondary" onClick={() => stationsQuery.refetch()} isLoading={stationsQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (stationsQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={TrainFront}
          title="No stations yet"
          description="Add a station with its photos and Google Maps address."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add station
            </Button>
          }
          className="mt-8"
        />
      )
    }

    const filteredStations = filterStations(stationsQuery.data, filters)

    return (
      <>
        <StationFilters filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />
        <div className="mt-4">
          <StationsTable stations={filteredStations} onEdit={openEditModal} onDelete={openDeleteDialog} />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Stations"
        description="Stations with their photos and location on Google Maps."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add station
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderStations()}

      <StationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stationToEdit={stationToEdit}
        onSaved={handleStationSaved}
      />

      <ConfirmDeleteModal
        isOpen={stationToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete station?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{stationToDelete?.name}</span> and all its images will be deleted.
          This cannot be undone.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
