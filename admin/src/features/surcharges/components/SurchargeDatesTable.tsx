import { SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { SurchargeDate } from '../types/surchargeDate'
import { formatSurchargeAmount } from '../utils/formatSurchargeAmount'
import { formatSurchargeDate } from '../utils/formatSurchargeDate'
import { SurchargeStatusBadge } from './SurchargeStatusBadge'

type SurchargeDatesTableProps = {
  surcharges: SurchargeDate[]
  onEdit: (surcharge: SurchargeDate) => void
  onDelete: (surcharge: SurchargeDate) => void
}

// All surcharges on date as a searchable, sortable table
export function SurchargeDatesTable({ surcharges, onEdit, onDelete }: SurchargeDatesTableProps) {
  const columns: DataTableColumn<SurchargeDate>[] = [
    {
      key: 'date',
      header: 'Date',
      // "YYYY-MM-DD" sorts correctly as plain text
      getValue: (row) => row.date,
      render: (row) => <span className="font-semibold text-ink">{formatSurchargeDate(row.date)}</span>,
    },
    {
      key: 'amount',
      header: 'Surcharge',
      getValue: (row) => row.amount,
      render: (row) => <span className="tabular-nums">{formatSurchargeAmount(row.amountType, row.amount)}</span>,
    },
    {
      key: 'time',
      header: 'Time window',
      getValue: (row) => row.fromTime,
      render: (row) => {
        if (row.fromTime === '') {
          return <span className="text-muted">All day</span>
        }
        return (
          <span className="tabular-nums">
            {row.fromTime} – {row.toTime}
          </span>
        )
      },
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
          <IconButton icon={SquarePen} label={`Edit ${formatSurchargeDate(row.date)}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete ${formatSurchargeDate(row.date)}`} onClick={() => onDelete(row)} />
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
      initialSort={{ columnKey: 'date', direction: 'asc' }}
      searchPlaceholder="Search surcharges…"
    />
  )
}
