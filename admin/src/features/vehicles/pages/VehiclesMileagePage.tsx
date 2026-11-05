import { Car, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { Modal } from '../../../shared/components/modals/Modal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddVehicleModal } from '../components/AddVehicleModal'
import { VehiclesTable } from '../components/VehiclesTable'
import { SAMPLE_VEHICLES } from '../data/sampleVehicles'
import type { Vehicle } from '../types/vehicle'

export function VehiclesMileagePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(SAMPLE_VEHICLES)
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
    setVehicles((current) => [...current, vehicle])
    setSuccessMessage(`${vehicle.name} was added`)
  }

  // TODO: call the backend's delete endpoint once it exists
  function confirmDelete() {
    if (!vehicleToDelete) return
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== vehicleToDelete.id))
    setSuccessMessage(`${vehicleToDelete.name} was deleted`)
    setVehicleToDelete(null)
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

      {vehicles.length > 0 ? (
        <div className="mt-8">
          <VehiclesTable vehicles={vehicles} onDelete={setVehicleToDelete} />
        </div>
      ) : (
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
      )}

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onVehicleAdded={handleVehicleAdded}
      />

      <Modal
        isOpen={vehicleToDelete !== null}
        onClose={() => setVehicleToDelete(null)}
        title="Delete vehicle?"
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setVehicleToDelete(null)}>
              Cancel
            </Button>
            <Button icon={Trash2} onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{vehicleToDelete?.name}</span> will be removed and customers won't be
          able to book it any more.
        </p>
      </Modal>
    </>
  )
}
