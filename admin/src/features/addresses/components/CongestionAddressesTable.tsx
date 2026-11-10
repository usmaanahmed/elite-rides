import { SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { CongestionAddress } from '../types/congestionAddress'

type CongestionAddressesTableProps = {
  addresses: CongestionAddress[]
  onEdit: (address: CongestionAddress) => void
  onDelete: (address: CongestionAddress) => void
}

// All congestion addresses as a searchable, sortable table
export function CongestionAddressesTable({ addresses, onEdit, onDelete }: CongestionAddressesTableProps) {
  const columns: DataTableColumn<CongestionAddress>[] = [
    {
      key: 'postcode',
      header: 'Postcode',
      getValue: (row) => row.postcode,
      render: (row) => <span className="font-semibold text-ink">{row.postcode}</span>,
    },
    {
      key: 'price',
      header: 'Congestion charge',
      getValue: (row) => row.price,
      render: (row) => <span className="tabular-nums">£{row.price.toFixed(2)}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit ${row.postcode}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete ${row.postcode}`} onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <DataTable
      rows={addresses}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'postcode', direction: 'asc' }}
      searchPlaceholder="Search by postcode…"
    />
  )
}
