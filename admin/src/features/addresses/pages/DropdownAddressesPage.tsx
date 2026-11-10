import { Download, MapPin, Plus, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { ImportResultModal } from '../../../shared/components/modals/ImportResultModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { downloadCsv } from '../../../shared/utils/downloadCsv'
import { parseCsvFile } from '../../../shared/utils/parseCsvFile'
import { DropdownAddressModal } from '../components/DropdownAddressModal'
import { DropdownAddressesTable } from '../components/DropdownAddressesTable'
import { useDeleteDropdownAddress, useDropdownAddresses, useImportDropdownAddresses } from '../hooks/useDropdownAddresses'
import type { DropdownAddress, ImportResult } from '../types/dropdownAddress'

// The column names of the CSV file (same names are used for the import)
const CSV_HEADER = ['address', 'comparable_value', 'pickup_charge', 'dropoff_charge', 'type']

// A CSV row has the columns above; this turns one into the shape the server's import API expects
function toImportRow(csvRow: Record<string, string>) {
  return {
    address: csvRow.address,
    comparableValue: csvRow.comparable_value,
    pickupCharge: csvRow.pickup_charge,
    dropoffCharge: csvRow.dropoff_charge,
    type: csvRow.type,
  }
}

export function DropdownAddressesPage() {
  // The addresses list from the server (React Query keeps it cached and up to date)
  const addressesQuery = useDropdownAddresses()
  const deleteMutation = useDeleteDropdownAddress()
  const importMutation = useImportDropdownAddresses()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The address open in the modal for editing (null = the modal adds a new address)
  const [addressToEdit, setAddressToEdit] = useState<DropdownAddress | null>(null)
  // The address waiting for the user to confirm its deletion (null = no dialog)
  const [addressToDelete, setAddressToDelete] = useState<DropdownAddress | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  // What the last CSV import did (null = no result to show yet)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  // Set when the file itself couldn't be read/imported, e.g. a bad file or a network error
  const [importError, setImportError] = useState<string | null>(null)
  // The hidden file input the "Import CSV" button opens
  const importFileInputRef = useRef<HTMLInputElement>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setAddressToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(address: DropdownAddress) {
    setSuccessMessage(null)
    setAddressToEdit(address)
    setIsModalOpen(true)
  }

  function handleAddressSaved(address: DropdownAddress, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`Address updated: ${address.address}`)
    } else {
      setSuccessMessage(`Address added: ${address.address}`)
    }
  }

  function openDeleteDialog(address: DropdownAddress) {
    deleteMutation.reset()
    setAddressToDelete(address)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setAddressToDelete(null)
  }

  async function confirmDelete() {
    if (!addressToDelete) return

    try {
      await deleteMutation.mutateAsync(addressToDelete.id)
      setSuccessMessage(`Address deleted: ${addressToDelete.address}`)
      setAddressToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Downloads all addresses as a CSV file
  function exportCsv() {
    if (!addressesQuery.data) return

    const rows = addressesQuery.data.map((address) => [
      address.address,
      address.comparableValue,
      address.pickupCharge,
      address.dropoffCharge,
      address.type,
    ])
    downloadCsv('dropdown-addresses.csv', CSV_HEADER, rows)
  }

  function openImportFilePicker() {
    setSuccessMessage(null)
    setImportError(null)
    importFileInputRef.current?.click()
  }

  // Runs when a CSV file is picked. Parses it in the browser, then sends the rows to the server.
  async function handleImportFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Clear the input so picking the same file again still fires this handler
    event.target.value = ''
    if (!file) return

    try {
      const csvRows = await parseCsvFile(file)
      const rows = csvRows.map(toImportRow)
      const result = await importMutation.mutateAsync(rows)

      if (result.errors.length === 0) {
        setSuccessMessage(`${result.addedCount} address${result.addedCount === 1 ? '' : 'es'} imported`)
      } else {
        // Errors list can be long, so it goes in a modal rather than a one-line alert
        setImportResult(result)
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'The file could not be imported. Please try again.')
    }
  }

  const hasAddresses = addressesQuery.isSuccess && addressesQuery.data.length > 0

  // Works out what the main part of the page should show
  function renderAddresses() {
    if (addressesQuery.isPending) {
      return <div className="mt-8 h-64 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (addressesQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Addresses could not be loaded" description={addressesQuery.error.message} />
          <Button variant="secondary" onClick={() => addressesQuery.refetch()} isLoading={addressesQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (addressesQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={MapPin}
          title="No drop down addresses yet"
          description="Add an address to make it selectable in the booking form."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add address
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <DropdownAddressesTable addresses={addressesQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Drop down Addresses"
        description="Addresses customers can pick from the drop down when booking."
        actions={
          <div className="flex items-center gap-2.5">
            <input
              ref={importFileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportFileSelected}
              className="hidden"
            />
            <Button variant="secondary" icon={Upload} onClick={openImportFilePicker} isLoading={importMutation.isPending}>
              Import CSV
            </Button>
            <Button variant="secondary" icon={Download} onClick={exportCsv} disabled={!hasAddresses}>
              Export CSV
            </Button>
            <Button icon={Plus} onClick={openAddModal}>
              Add address
            </Button>
          </div>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {importError && (
        <Alert variant="error" title="The file could not be imported" description={importError} onDismiss={() => setImportError(null)} className="mt-6" />
      )}

      {renderAddresses()}

      <DropdownAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addressToEdit={addressToEdit}
        onSaved={handleAddressSaved}
      />

      <ConfirmDeleteModal
        isOpen={addressToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete address?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{addressToDelete?.address}</span> will be removed from the booking
          form drop down.
        </p>
      </ConfirmDeleteModal>

      {importResult && (
        <ImportResultModal
          isOpen
          onClose={() => setImportResult(null)}
          addedCount={importResult.addedCount}
          errors={importResult.errors}
          itemLabel="address"
        />
      )}
    </>
  )
}
