import { SquarePen } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import { getTodayDateString } from '../../../shared/utils/getTodayDateString'
import type { Coupon } from '../types/coupon'

type CouponsTableProps = {
  coupons: Coupon[]
  onEdit: (coupon: Coupon) => void
}

// Turns "2026-12-25" into "25 Dec 2026" (the "T00:00" keeps it in local time)
function formatExpiryDate(date: string): string {
  return new Date(`${date}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// All coupons as a searchable, sortable table
export function CouponsTable({ coupons, onEdit }: CouponsTableProps) {
  const today = getTodayDateString()

  const columns: DataTableColumn<Coupon>[] = [
    {
      key: 'code',
      header: 'Code',
      getValue: (row) => row.code,
      render: (row) => <span className="font-semibold tracking-wide text-ink">{row.code}</span>,
    },
    {
      key: 'discount',
      header: 'Discount',
      getValue: (row) => row.discountValue,
      render: (row) => {
        if (row.discountType === 'percent') {
          return <span className="tabular-nums">{row.discountValue}%</span>
        }
        return <span className="tabular-nums">£{row.discountValue.toFixed(2)}</span>
      },
    },
    {
      key: 'expiry',
      header: 'Expires',
      // Coupons that never expire sort last
      getValue: (row) => (row.expiryDate === '' ? '9999-12-31' : row.expiryDate),
      render: (row) => {
        if (row.expiryDate === '') {
          return <span className="text-muted">Never</span>
        }
        if (row.expiryDate < today) {
          return <span className="text-danger">{formatExpiryDate(row.expiryDate)} (expired)</span>
        }
        return <span>{formatExpiryDate(row.expiryDate)}</span>
      },
    },
    {
      key: 'used',
      header: 'Used',
      getValue: (row) => row.usedCount,
      render: (row) => {
        if (row.usageLimit === 0) {
          return <span className="tabular-nums">{row.usedCount} / Unlimited</span>
        }
        return (
          <span className="tabular-nums">
            {row.usedCount} / {row.usageLimit}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      getValue: (row) => row.status,
      render: (row) => {
        if (row.status === 'active') {
          return <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">Active</span>
        }
        return <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted">Inactive</span>
      },
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit ${row.code}`} onClick={() => onEdit(row)} />
        </div>
      ),
      className: 'w-20',
    },
  ]

  return (
    <DataTable
      rows={coupons}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'code', direction: 'asc' }}
      searchPlaceholder="Search by code…"
    />
  )
}
