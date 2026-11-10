import { SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import { ADDRESS_TYPES } from '../constants/addressTypes'
import type { AddressType, DropdownAddress } from '../types/dropdownAddress'

type DropdownAddressesTableProps = {
  addresses: DropdownAddress[]
  onEdit: (address: DropdownAddress) => void
  onDelete: (address: DropdownAddress) => void
}

// Shows e.g. "Airport" for the value 'airport'
function getTypeLabel(type: AddressType): string {
  const found = ADDRESS_TYPES.find((item) => item.value === type)
  if (found) return found.label
  return type
}

// Shows e.g. "£7.50"
function formatCharge(charge: number): string {
  return '£' + charge.toFixed(2)
}

// All drop down addresses as a searchable, sortable table
export function DropdownAddressesTable({ addresses, onEdit, onDelete }: DropdownAddressesTableProps) {
  const columns: DataTableColumn<DropdownAddress>[] = [
    {
      key: 'address',
      header: 'Address',
      getValue: (row) => row.address,
      render: (row) => <span className="font-semibold text-ink">{row.address}</span>,
      className: 'min-w-56',
    },
    {
      key: 'comparableValue',
      header: 'Comparable value',
      getValue: (row) => row.comparableValue,
      className: 'text-muted',
    },
    {
      key: 'type',
      header: 'Type',
      getValue: (row) => getTypeLabel(row.type),
    },
    {
      key: 'pickupCharge',
      header: 'Pickup charge',
      getValue: (row) => row.pickupCharge,
      render: (row) => <span className="tabular-nums">{formatCharge(row.pickupCharge)}</span>,
    },
    {
      key: 'dropoffCharge',
      header: 'Drop-off charge',
      getValue: (row) => row.dropoffCharge,
      render: (row) => <span className="tabular-nums">{formatCharge(row.dropoffCharge)}</span>,
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
      searchPlaceholder="Search by address or comparable value…"
    />
  )
}
