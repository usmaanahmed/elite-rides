import { SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { SurchargeNight } from '../types/surchargeNight'
import { formatSurchargeAmount } from '../utils/formatSurchargeAmount'
import { SurchargeStatusBadge } from './SurchargeStatusBadge'

type SurchargeNightTableProps = {
  surcharges: SurchargeNight[]
  onEdit: (surcharge: SurchargeNight) => void
  onDelete: (surcharge: SurchargeNight) => void
}

// All night surcharges as a searchable, sortable table
export function SurchargeNightTable({ surcharges, onEdit, onDelete }: SurchargeNightTableProps) {
  const columns: DataTableColumn<SurchargeNight>[] = [
    {
      key: 'window',
      header: 'Night window',
      // "HH:mm" sorts correctly as plain text
      getValue: (row) => row.startTime,
      render: (row) => (
        <span className="font-semibold tabular-nums text-ink">
          {row.startTime} – {row.endTime}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Surcharge',
      getValue: (row) => row.amount,
      render: (row) => <span className="tabular-nums">{formatSurchargeAmount(row.amountType, row.amount)}</span>,
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
          <IconButton icon={SquarePen} label={`Edit ${row.startTime} to ${row.endTime}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete ${row.startTime} to ${row.endTime}`} onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <DataTable
      rows={surcharges}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'window', direction: 'asc' }}
      searchPlaceholder="Search night surcharges…"
    />
  )
}
