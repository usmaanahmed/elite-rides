import { ImageOff, SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { EventItem } from '../types/event'

type EventsTableProps = {
  events: EventItem[]
  onEdit: (event: EventItem) => void
  onDelete: (event: EventItem) => void
}

// All events as a searchable, sortable table
export function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  const columns: DataTableColumn<EventItem>[] = [
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
      header: 'Event name',
      getValue: (row) => row.name,
      render: (row) => <span className="font-semibold text-ink">{row.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      getValue: (row) => row.description,
      render: (row) => <span className="line-clamp-2 max-w-md text-muted">{row.description || '—'}</span>,
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
      rows={events}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'name', direction: 'asc' }}
      searchPlaceholder="Search events…"
    />
  )
}
