import { SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { FixedPrice } from '../types/fixedPrice'

type FixedPricesTableProps = {
  fixedPrices: FixedPrice[]
  onEdit: (fixedPrice: FixedPrice) => void
  onDelete: (fixedPrice: FixedPrice) => void
}

// Shows e.g. "£89.25"
function formatFare(fare: number): string {
  return '£' + fare.toFixed(2)
}

// All fixed-price rows as a searchable, sortable table. One row = one vehicle's fare on one route.
export function FixedPricesTable({ fixedPrices, onEdit, onDelete }: FixedPricesTableProps) {
  const columns: DataTableColumn<FixedPrice>[] = [
    {
      key: 'pickupPostcode',
      header: 'Pickup postcode',
      getValue: (row) => row.pickupPostcode,
      render: (row) => <span className="font-semibold text-ink">{row.pickupPostcode}</span>,
    },
    {
      key: 'dropCode',
      header: 'Drop-off code',
      getValue: (row) => row.dropCode,
      className: 'text-muted',
    },
    {
      key: 'vehicleName',
      header: 'Vehicle',
      getValue: (row) => row.vehicleName,
    },
    {
      key: 'fare',
      header: 'Fare',
      getValue: (row) => row.fare,
      render: (row) => <span className="tabular-nums">{formatFare(row.fare)}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit fixed price for ${row.vehicleName}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete fixed price for ${row.vehicleName}`} onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <DataTable
      rows={fixedPrices}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'pickupPostcode', direction: 'asc' }}
      searchPlaceholder="Search by postcode, drop code or vehicle…"
    />
  )
}
