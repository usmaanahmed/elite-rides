import { ImageOff, SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { TourItem } from '../types/tour'

type ToursTableProps = {
  tours: TourItem[]
  onEdit: (tour: TourItem) => void
  onDelete: (tour: TourItem) => void
}

// The lowest price of a tour, e.g. "From £120.00" ("—" if no vehicle has a price)
function getStartingPriceText(tour: TourItem): string {
  if (tour.prices.length === 0) {
    return '—'
  }
  let lowestPrice = tour.prices[0].price
  for (const item of tour.prices) {
    if (item.price < lowestPrice) {
      lowestPrice = item.price
    }
  }
  return `From £${lowestPrice.toFixed(2)}`
}

// All tours as a searchable, sortable table
export function ToursTable({ tours, onEdit, onDelete }: ToursTableProps) {
  const columns: DataTableColumn<TourItem>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (row) => {
        if (row.images.length === 0) {
          return (
            <span className="grid h-12 w-16 place-items-center rounded-lg border border-line bg-surface-muted text-muted">
              <ImageOff className="size-4" strokeWidth={1.75} />
            </span>
          )
        }
        return (
          <div className="relative w-16">
            <img src={row.images[0].url} alt={row.title} className="h-12 w-16 rounded-lg border border-line object-cover" />
            {row.images.length > 1 && (
              <span className="absolute -bottom-1 -right-1 rounded-full bg-ink px-1.5 text-[10px] font-semibold text-white">
                +{row.images.length - 1}
              </span>
            )}
          </div>
        )
      },
      className: 'w-24',
    },
    {
      key: 'title',
      header: 'Tour',
      getValue: (row) => row.title,
      render: (row) => <span className="font-semibold text-ink">{row.title}</span>,
    },
    {
      key: 'vehicles',
      header: 'Vehicles',
      getValue: (row) => row.prices.length,
      render: (row) => <span className="text-muted">{row.prices.length} priced</span>,
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="tabular-nums text-ink">{getStartingPriceText(row)}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit ${row.title}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete ${row.title}`} onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <DataTable
      rows={tours}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'title', direction: 'asc' }}
      searchPlaceholder="Search tours…"
    />
  )
}
