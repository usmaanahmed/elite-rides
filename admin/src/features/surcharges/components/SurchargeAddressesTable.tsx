import { SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { SurchargeAddress } from '../types/surchargeAddress'
import { SurchargeStatusBadge } from './SurchargeStatusBadge'

type SurchargeAddressesTableProps = {
  addresses: SurchargeAddress[]
  onEdit: (address: SurchargeAddress) => void
  onDelete: (address: SurchargeAddress) => void
}

// All surcharge addresses as a searchable, sortable table
export function SurchargeAddressesTable({ addresses, onEdit, onDelete }: SurchargeAddressesTableProps) {
  const columns: DataTableColumn<SurchargeAddress>[] = [
    {
      key: 'address',
      header: 'Address',
      getValue: (row) => row.address,
      render: (row) => <span className="font-semibold text-ink">{row.address}</span>,
    },
    {
      key: 'time',
      header: 'Time window',
      getValue: (row) => row.fromTime,
      render: (row) => (
        <span className="tabular-nums">
          {row.fromTime} – {row.toTime}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Surcharge',
      getValue: (row) => row.price,
      render: (row) => <span className="tabular-nums">£{row.price.toFixed(2)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      getValue: (row) => row.status,
      render: (row) => <SurchargeStatusBadge status={row.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit ${row.address}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete ${row.address}`} onClick={() => onDelete(row)} />
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
      initialSort={{ columnKey: 'address', direction: 'asc' }}
      searchPlaceholder="Search by address…"
    />
  )
}
