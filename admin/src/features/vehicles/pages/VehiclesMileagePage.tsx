import { Car, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { Modal } from '../../../shared/components/modals/Modal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddVehicleModal } from '../components/AddVehicleModal'
import { VehiclesTable } from '../components/VehiclesTable'
import { useDeleteVehicle } from '../hooks/useDeleteVehicle'
import { useVehicles } from '../hooks/useVehicles'
import type { Vehicle } from '../types/vehicle'

export function VehiclesMileagePage() {
  // The vehicles list from the server (React Query keeps it cached and up to date)
  const vehiclesQuery = useVehicles()
  const deleteVehicleMutation = useDeleteVehicle()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // The vehicle waiting for the user to confirm its deletion (null = no dialog)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
  // Text for the success message, e.g. "Saloon was added" (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleVehicleAdded(vehicle: Vehicle) {
    setSuccessMessage(`${vehicle.name} was added`)
  }

  function openDeleteDialog(vehicle: Vehicle) {
    deleteVehicleMutation.reset()
    setVehicleToDelete(vehicle)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteVehicleMutation.isPending) return
    setVehicleToDelete(null)
  }

  async function confirmDelete() {
    if (!vehicleToDelete) return

    try {
      await deleteVehicleMutation.mutateAsync(vehicleToDelete.id)
      setSuccessMessage(`${vehicleToDelete.name} was deleted`)
      setVehicleToDelete(null)
    } catch {
      // The error is shown inside the dialog (see deleteVehicleMutation.error below)
    }
  }

  // Works out what the main part of the page should show
  function renderVehicles() {
    if (vehiclesQuery.isPending) {
      return (
        <div className="mt-8 flex items-center justify-center gap-2 py-16 text-sm text-muted">
          <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
          Loading vehicles…
        </div>
      )
    }

    if (vehiclesQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Vehicles could not be loaded" description={vehiclesQuery.error.message} />
          <Button variant="secondary" onClick={() => vehiclesQuery.refetch()} isLoading={vehiclesQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (vehiclesQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={Car}
          title="No vehicles yet"
          description="Add a vehicle to set its mileage rates."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add vehicle
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <VehiclesTable vehicles={vehiclesQuery.data} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Vehicles & Mileage Setting"
        description="Manage vehicle types and the price charged per mile."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add vehicle
          </Button>
        }
      />

      {successMessage && (
        <Alert
          variant="success"
          title={successMessage}
          onDismiss={() => setSuccessMessage(null)}
          className="mt-6"
        />
      )}

      {renderVehicles()}

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onVehicleAdded={handleVehicleAdded}
      />

      <Modal
        isOpen={vehicleToDelete !== null}
        onClose={closeDeleteDialog}
        title="Delete vehicle?"
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={closeDeleteDialog} disabled={deleteVehicleMutation.isPending}>
              Cancel
            </Button>
            <Button icon={Trash2} onClick={confirmDelete} isLoading={deleteVehicleMutation.isPending}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{vehicleToDelete?.name}</span> will be removed and customers won't
            be able to book it any more.
          </p>
          {deleteVehicleMutation.isError && (
            <Alert variant="error" title="The vehicle could not be deleted" description={deleteVehicleMutation.error.message} />
          )}
        </div>
      </Modal>
    </>
  )
}
