import { BriefcaseBusiness, CarFront, Luggage, PoundSterling, SquarePen, Trash2, Users, type LucideIcon } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { Vehicle } from '../types/vehicle'
import { getRateText } from '../utils/getRateText'

// A vehicle plus its position in the list, shown in the "#" column
type VehicleRow = Vehicle & { srNo: number }

type VehiclesTableProps = {
  vehicles: Vehicle[]
  onEdit: (vehicle: Vehicle) => void
  onEditRates: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
}

// All vehicles as a searchable, sortable table (the "Table" view of the Vehicles page)
export function VehiclesTable({ vehicles, onEdit, onEditRates, onDelete }: VehiclesTableProps) {
  const rows: VehicleRow[] = vehicles.map((vehicle, index) => ({ ...vehicle, srNo: index + 1 }))

  const columns: DataTableColumn<VehicleRow>[] = [
    { key: 'srNo', header: '#', getValue: (row) => row.srNo, className: 'w-14 tabular-nums text-muted' },
    {
      key: 'vehicle',
      header: 'Vehicle',
      // Name and TBMS ID together, so the search box finds a vehicle by either one
      getValue: (row) => `${row.name} ${row.tbmsId}`,
      render: (row) => <VehicleNameCell vehicle={row} />,
    },
    {
      key: 'description',
      header: 'Description',
      getValue: (row) => row.description,
      render: (row) => {
        if (!row.description) {
          return <span className="text-muted">—</span>
        }
        return (
          <p className="line-clamp-2 max-w-sm text-muted" title={row.description}>
            {row.description}
          </p>
        )
      },
      className: 'min-w-56',
    },
    {
      key: 'passengers',
      header: 'Passengers',
      getValue: (row) => row.passengerCapacity,
      render: (row) => <CapacityCell icon={Users} value={row.passengerCapacity} />,
    },
    {
      key: 'luggage',
      header: 'Suitcases',
      getValue: (row) => row.luggageCapacity,
      render: (row) => <CapacityCell icon={Luggage} value={row.luggageCapacity} />,
    },
    {
      key: 'handLuggage',
      header: 'Hand bags',
      getValue: (row) => row.handLuggageCapacity,
      render: (row) => <CapacityCell icon={BriefcaseBusiness} value={row.handLuggageCapacity} />,
    },
    {
      key: 'rates',
      header: 'Distance rate',
      render: (row) => <RateCell vehicle={row} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit ${row.name}`} onClick={() => onEdit(row)} />
          <IconButton icon={PoundSterling} label={`£ Rates for ${row.name}`} onClick={() => onEditRates(row)} />
          <IconButton icon={Trash2} label={`Delete ${row.name}`} onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-32',
    },
  ]

  return (
    <DataTable
      rows={rows}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'srNo', direction: 'asc' }}
      searchPlaceholder="Search by name or TBMS ID…"
    />
  )
}

type VehicleNameCellProps = {
  vehicle: Vehicle
}

// Small photo, vehicle name and its TBMS ID
function VehicleNameCell({ vehicle }: VehicleNameCellProps) {
  return (
    <div className="flex items-center gap-3">
      {vehicle.imageUrl ? (
        <img
          src={vehicle.imageUrl}
          alt=""
          className="h-12 w-20 shrink-0 rounded-lg border border-line bg-linear-to-b from-surface-muted to-surface object-contain p-1"
        />
      ) : (
        <div className="grid h-12 w-20 shrink-0 place-items-center rounded-lg border border-line bg-surface-muted text-accent">
          <CarFront className="size-5" strokeWidth={1.75} />
        </div>
      )}
      <div className="min-w-0">
        <p className="whitespace-nowrap font-semibold text-ink">{vehicle.name}</p>
        <p className="mt-0.5 text-xs tabular-nums text-muted">TBMS {vehicle.tbmsId}</p>
      </div>
    </div>
  )
}

type CapacityCellProps = {
  icon: LucideIcon
  value: number
}

// A capacity number with its icon, e.g. [people icon] 4
function CapacityCell({ icon: Icon, value }: CapacityCellProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      <span className="font-semibold tabular-nums text-ink">{value}</span>
    </span>
  )
}

type RateCellProps = {
  vehicle: Vehicle
}

// e.g. "From £1.80/mile · 3 bands", or an orange "Not set yet" pill when there are no rates
function RateCell({ vehicle }: RateCellProps) {
  const rateText = getRateText(vehicle)

  if (rateText) {
    return <span className="whitespace-nowrap text-ink">{rateText}</span>
  }
  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-ink">
      Not set yet
    </span>
  )
}
