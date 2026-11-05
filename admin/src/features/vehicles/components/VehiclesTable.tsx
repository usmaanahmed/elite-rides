import { Car, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { Vehicle } from '../types/vehicle'

// A vehicle plus its position in the list, shown in the "Sr #" column
type VehicleRow = Vehicle & { srNo: number }

type VehiclesTableProps = {
  vehicles: Vehicle[]
  onDelete: (vehicle: Vehicle) => void
}

export function VehiclesTable({ vehicles, onDelete }: VehiclesTableProps) {
  const rows: VehicleRow[] = vehicles.map((vehicle, index) => ({ ...vehicle, srNo: index + 1 }))

  const columns: DataTableColumn<VehicleRow>[] = [
    { key: 'srNo', header: 'Sr #', getValue: (row) => row.srNo, className: 'w-20 tabular-nums' },
    {
      key: 'name',
      header: 'Name',
      getValue: (row) => row.name,
      render: (row) => <span className="whitespace-nowrap font-semibold">{row.name}</span>,
    },
    { key: 'tbmsId', header: 'TBMS ID', getValue: (row) => row.tbmsId, className: 'tabular-nums' },
    {
      key: 'description',
      header: 'Description',
      getValue: (row) => row.description,
      render: (row) =>
        row.description ? (
          <p className="line-clamp-2 max-w-md text-muted" title={row.description}>
            {row.description}
          </p>
        ) : (
          <span className="text-muted">—</span>
        ),
      className: 'min-w-56',
    },
    { key: 'seats', header: 'Seat Capacity', getValue: (row) => row.passengerCapacity, className: 'tabular-nums' },
    { key: 'luggage', header: 'Luggage Capacity', getValue: (row) => row.luggageCapacity, className: 'tabular-nums' },
    {
      key: 'image',
      header: 'Img',
      render: (row) =>
        row.imageUrl ? (
          <img
            src={row.imageUrl}
            alt={row.name}
            className="h-10 w-16 rounded-lg border border-line bg-surface-muted object-cover"
          />
        ) : (
          <div className="grid h-10 w-16 place-items-center rounded-lg bg-surface-muted text-muted">
            <Car className="size-5" strokeWidth={1.75} />
          </div>
        ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => <IconButton icon={Trash2} label={`Delete ${row.name}`} onClick={() => onDelete(row)} />,
      className: 'w-20',
    },
  ]

  return (
    <DataTable
      rows={rows}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'srNo', direction: 'asc' }}
      searchPlaceholder="Search vehicles…"
    />
  )
}
