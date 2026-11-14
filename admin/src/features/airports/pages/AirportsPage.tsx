import { Plane, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AirportFilters } from '../components/AirportFilters'
import { AirportModal } from '../components/AirportModal'
import { AirportsTable } from '../components/AirportsTable'
import { useAirports, useDeleteAirport } from '../hooks/useAirports'
import type { Airport, AirportFilterValues } from '../types/airport'
import { filterAirports } from '../utils/filterAirports'

const emptyFilters: AirportFilterValues = { name: '', address: '', images: 'all' }

export function AirportsPage() {
  // The airports from the server (React Query keeps it cached and up to date)
  const airportsQuery = useAirports()
  const deleteMutation = useDeleteAirport()

  const [filters, setFilters] = useState<AirportFilterValues>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // The airport open in the modal for editing (null = the modal adds a new airport)
  const [airportToEdit, setAirportToEdit] = useState<Airport | null>(null)
  // The airport waiting for the user to confirm its deletion (null = no dialog)
  const [airportToDelete, setAirportToDelete] = useState<Airport | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setAirportToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(airport: Airport) {
    setSuccessMessage(null)
    setAirportToEdit(airport)
    setIsModalOpen(true)
  }

  function handleAirportSaved(airport: Airport, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`"${airport.name}" was updated`)
    } else {
      setSuccessMessage(`"${airport.name}" was added`)
    }
  }

  function openDeleteDialog(airport: Airport) {
    deleteMutation.reset()
    setAirportToDelete(airport)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setAirportToDelete(null)
  }

  async function confirmDelete() {
    if (!airportToDelete) return

    try {
      await deleteMutation.mutateAsync(airportToDelete.id)
      setSuccessMessage(`"${airportToDelete.name}" was deleted`)
      setAirportToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderAirports() {
    if (airportsQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (airportsQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Airports could not be loaded" description={airportsQuery.error.message} />
          <Button variant="secondary" onClick={() => airportsQuery.refetch()} isLoading={airportsQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (airportsQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={Plane}
          title="No airports yet"
          description="Add an airport with its photos and Google Maps address."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add airport
            </Button>
          }
          className="mt-8"
        />
      )
    }

    const filteredAirports = filterAirports(airportsQuery.data, filters)

    return (
      <>
        <AirportFilters filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />
        <div className="mt-4">
          <AirportsTable airports={filteredAirports} onEdit={openEditModal} onDelete={openDeleteDialog} />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Airports"
        description="Airports with their photos and location on Google Maps."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add airport
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderAirports()}

      <AirportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        airportToEdit={airportToEdit}
        onSaved={handleAirportSaved}
      />

      <ConfirmDeleteModal
        isOpen={airportToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete airport?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{airportToDelete?.name}</span> and all its images will be deleted.
          This cannot be undone.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
