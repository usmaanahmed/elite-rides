import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { Alert } from '../../../shared/components/feedback/Alert'
import { SegmentedControl } from '../../../shared/components/inputs/SegmentedControl'
import { Modal } from '../../../shared/components/modals/Modal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddVehicleModal } from '../components/AddVehicleModal'
import { CalculationFormatModal } from '../components/CalculationFormatModal'
import { EditVehicleModal } from '../components/EditVehicleModal'
import { FleetSummary } from '../components/FleetSummary'
import { VehicleRatesModal } from '../components/VehicleRatesModal'
import { VehiclesEmptyState } from '../components/VehiclesEmptyState'
import { VehiclesGrid } from '../components/VehiclesGrid'
import { VehiclesGridSkeleton } from '../components/VehiclesGridSkeleton'
import { VehiclesTable } from '../components/VehiclesTable'
import { useDeleteVehicle } from '../hooks/useDeleteVehicle'
import { useVehicles } from '../hooks/useVehicles'
import type { Vehicle } from '../types/vehicle'

// The two ways to show the vehicles: as cards (the default) or as a table
const VIEW_OPTIONS = [
  { value: 'cards', label: 'Cards' },
  { value: 'table', label: 'Table' },
]

export function VehiclesMileagePage() {
  // The vehicles list from the server (React Query keeps it cached and up to date)
  const vehiclesQuery = useVehicles()
  const deleteVehicleMutation = useDeleteVehicle()

  // 'cards' or 'table'
  const [view, setView] = useState('cards')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCalculationFormatModalOpen, setIsCalculationFormatModalOpen] = useState(false)
  // The vehicle open in the Edit / £ Rates modal (null = that modal is closed)
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null)
  const [vehicleToEditRates, setVehicleToEditRates] = useState<Vehicle | null>(null)
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

  function handleVehicleUpdated(vehicle: Vehicle) {
    setSuccessMessage(`${vehicle.name} was updated`)
  }

  function handleRatesSaved(vehicle: Vehicle) {
    setSuccessMessage(`Rates saved for ${vehicle.name}`)
  }

  function handleCalculationFormatSaved() {
    setSuccessMessage('Calculation format saved')
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

  // True once the list has loaded and there are no vehicles in it
  const isFleetEmpty = vehiclesQuery.isSuccess && vehiclesQuery.data.length === 0

  // The header buttons. Hidden while there are no vehicles, because the empty
  // state has its own big "Add your first vehicle" button.
  function renderHeaderActions() {
    if (isFleetEmpty) return null

    return (
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" icon={SlidersHorizontal} onClick={() => setIsCalculationFormatModalOpen(true)}>
          Calculation format
        </Button>
        <Button icon={Plus} onClick={openAddModal}>
          Add vehicle
        </Button>
      </div>
    )
  }

  // Works out what the main part of the page should show
  function renderVehicles() {
    if (vehiclesQuery.isPending) {
      return (
        <div className="mt-8">
          <VehiclesGridSkeleton />
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
        <div className="mt-8">
          <VehiclesEmptyState onAddVehicle={openAddModal} />
        </div>
      )
    }

    const vehicles = vehiclesQuery.data

    return (
      <>
        <div className="mt-6 sm:mt-8">
          <FleetSummary vehicles={vehicles} />
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-3 sm:mt-10">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">Your fleet</h2>
            <p className="mt-0.5 text-sm text-muted">Seats, luggage space and rates for every vehicle.</p>
          </div>
          <SegmentedControl label="Show vehicles as" options={VIEW_OPTIONS} value={view} onChange={setView} />
        </div>

        <div className="mt-4">
          {view === 'table' ? (
            <VehiclesTable
              vehicles={vehicles}
              onEdit={setVehicleToEdit}
              onEditRates={setVehicleToEditRates}
              onDelete={openDeleteDialog}
            />
          ) : (
            <VehiclesGrid
              vehicles={vehicles}
              onAddVehicle={openAddModal}
              onEdit={setVehicleToEdit}
              onEditRates={setVehicleToEditRates}
              onDelete={openDeleteDialog}
            />
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Vehicles & Mileage Setting"
        description="Every vehicle customers can book: how many passengers and bags it carries, and its price per mile."
        actions={renderHeaderActions()}
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

      <EditVehicleModal
        isOpen={vehicleToEdit !== null}
        onClose={() => setVehicleToEdit(null)}
        vehicle={vehicleToEdit}
        onVehicleUpdated={handleVehicleUpdated}
      />

      <VehicleRatesModal
        isOpen={vehicleToEditRates !== null}
        onClose={() => setVehicleToEditRates(null)}
        vehicle={vehicleToEditRates}
        onRatesSaved={handleRatesSaved}
      />

      {vehiclesQuery.data && (
        <CalculationFormatModal
          isOpen={isCalculationFormatModalOpen}
          onClose={() => setIsCalculationFormatModalOpen(false)}
          vehicles={vehiclesQuery.data}
          onSaved={handleCalculationFormatSaved}
        />
      )}

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
