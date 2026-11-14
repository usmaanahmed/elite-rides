import { ExternalLink, ImageOff, SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { Airport } from '../types/airport'

type AirportsTableProps = {
  airports: Airport[]
  onEdit: (airport: Airport) => void
  onDelete: (airport: Airport) => void
}

// A link that opens the address in Google Maps (no API key needed)
function getGoogleMapsLink(address: string): string {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address)
}

// All airports as a searchable, sortable table
export function AirportsTable({ airports, onEdit, onDelete }: AirportsTableProps) {
  const columns: DataTableColumn<Airport>[] = [
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
            <img src={row.images[0].url} alt={row.name} className="h-12 w-16 rounded-lg border border-line object-cover" />
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
      key: 'name',
      header: 'Airport name',
      getValue: (row) => row.name,
      render: (row) => <span className="font-semibold text-ink">{row.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      getValue: (row) => row.description,
      render: (row) => <span className="line-clamp-2 max-w-xs text-muted">{row.description || '—'}</span>,
    },
    {
      key: 'address',
      header: 'Address',
      getValue: (row) => row.address,
      render: (row) => (
        <a
          href={getGoogleMapsLink(row.address)}
          target="_blank"
          rel="noreferrer"
          title="Open in Google Maps"
          className="inline-flex max-w-xs items-start gap-1.5 text-accent-ink hover:underline"
        >
          <span>{row.address}</span>
          <ExternalLink className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
        </a>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit ${row.name}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete ${row.name}`} onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <DataTable
      rows={airports}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'name', direction: 'asc' }}
      searchPlaceholder="Search airports…"
    />
  )
}
