import { Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { BanAddress } from '../types/banAddress'

type BanAddressesTableProps = {
  addresses: BanAddress[]
  onDelete: (address: BanAddress) => void
}

// All banned addresses as a searchable table
export function BanAddressesTable({ addresses, onDelete }: BanAddressesTableProps) {
  const columns: DataTableColumn<BanAddress>[] = [
    {
      key: 'address',
      header: 'Address',
      getValue: (row) => row.address,
      render: (row) => <span className="font-semibold text-ink">{row.address}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <IconButton icon={Trash2} label={`Remove ${row.address} from the ban list`} onClick={() => onDelete(row)} />
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
      searchPlaceholder="Search banned addresses…"
    />
  )
}
