import { Plus } from 'lucide-react'
import type { Vehicle } from '../types/vehicle'
import { getFleetCapacity } from '../utils/getFleetCapacity'
import { VehicleCard } from './VehicleCard'

type VehiclesGridProps = {
  vehicles: Vehicle[]
  onAddVehicle: () => void
  onEdit: (vehicle: Vehicle) => void
  onEditRates: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
}

// All vehicles as cards, with an "Add another vehicle" tile at the end
export function VehiclesGrid({ vehicles, onAddVehicle, onEdit, onEditRates, onDelete }: VehiclesGridProps) {
  // Worked out once for the whole fleet, so every card's bars use the same scale
  const fleetCapacity = getFleetCapacity(vehicles)

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          fleetCapacity={fleetCapacity}
          onEdit={onEdit}
          onEditRates={onEditRates}
          onDelete={onDelete}
        />
      ))}
      <AddVehicleTile onClick={onAddVehicle} />
    </div>
  )
}

type AddVehicleTileProps = {
  onClick: () => void
}

// A dashed "empty parking space" at the end of the grid for adding the next vehicle
function AddVehicleTile({ onClick }: AddVehicleTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line p-6 text-center transition-colors hover:border-accent/50 hover:bg-accent-soft/40 focus-visible:border-accent focus-visible:outline-none"
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
        <Plus className="size-6" strokeWidth={2} />
      </span>
      <span className="text-sm font-semibold text-ink">Add another vehicle</span>
      <span className="max-w-56 text-xs text-muted">Give customers a bigger, smaller or more premium option.</span>
    </button>
  )
}
