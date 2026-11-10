import { Banknote, Download, FileDown, Plus, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { ImportResultModal } from '../../../shared/components/modals/ImportResultModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { downloadCsv } from '../../../shared/utils/downloadCsv'
import { parseCsvFile } from '../../../shared/utils/parseCsvFile'
import { AddFixedPriceModal } from '../components/AddFixedPriceModal'
import { EditFixedPriceModal } from '../components/EditFixedPriceModal'
import { FixedPricesTable } from '../components/FixedPricesTable'
import { useDeleteAllFixedPrices, useDeleteFixedPrice, useFixedPrices, useImportFixedPrices } from '../hooks/useFixedPrices'
import type { FixedPrice, ImportResult } from '../types/fixedPrice'

// The column names of the CSV file (same names are used for the import)
const CSV_HEADER = ['pickup', 'drop_code', 'fare', 'vehicle']

export function FixedPricePage() {
  const fixedPricesQuery = useFixedPrices()
  const deleteMutation = useDeleteFixedPrice()
  const deleteAllMutation = useDeleteAllFixedPrices()
  const importMutation = useImportFixedPrices()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // The row open in the Edit modal (null = the modal is closed)
  const [fixedPriceToEdit, setFixedPriceToEdit] = useState<FixedPrice | null>(null)
  // The row waiting for the user to confirm its deletion (null = no dialog)
  const [fixedPriceToDelete, setFixedPriceToDelete] = useState<FixedPrice | null>(null)
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false)
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
    setIsAddModalOpen(true)
  }

  function handleFixedPriceAdded(saved: FixedPrice[]) {
    if (saved.length === 0) return
    setSuccessMessage(`Fixed price added for ${saved[0].pickupPostcode} → ${saved[0].dropCode}`)
  }

  function openEditModal(fixedPrice: FixedPrice) {
    setSuccessMessage(null)
    setFixedPriceToEdit(fixedPrice)
  }

  function handleFixedPriceSaved(fixedPrice: FixedPrice) {
    setSuccessMessage(`Fixed price updated: ${fixedPrice.pickupPostcode} → ${fixedPrice.dropCode}`)
  }

  function openDeleteDialog(fixedPrice: FixedPrice) {
    deleteMutation.reset()
    setFixedPriceToDelete(fixedPrice)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setFixedPriceToDelete(null)
  }

  async function confirmDelete() {
    if (!fixedPriceToDelete) return

    try {
      await deleteMutation.mutateAsync(fixedPriceToDelete.id)
      setSuccessMessage(`Fixed price deleted: ${fixedPriceToDelete.pickupPostcode} → ${fixedPriceToDelete.dropCode}`)
      setFixedPriceToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  function openDeleteAllDialog() {
    deleteAllMutation.reset()
    setIsDeleteAllModalOpen(true)
  }

  function closeDeleteAllDialog() {
    if (deleteAllMutation.isPending) return
    setIsDeleteAllModalOpen(false)
  }

  async function confirmDeleteAll() {
    try {
      await deleteAllMutation.mutateAsync()
      setSuccessMessage('All fixed prices were deleted')
      setIsDeleteAllModalOpen(false)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Downloads all fixed-price rows as a CSV file
  function exportCsv() {
    if (!fixedPricesQuery.data) return

    const rows = fixedPricesQuery.data.map((fixedPrice) => [
      fixedPrice.pickupPostcode,
      fixedPrice.dropCode,
      fixedPrice.fare,
      fixedPrice.vehicleName,
    ])
    downloadCsv('fixed-prices.csv', CSV_HEADER, rows)
  }

  // Downloads an empty CSV with the right columns and one example row, so admins know the format to follow
  function downloadTemplate() {
    const exampleVehicleName = fixedPricesQuery.data?.[0]?.vehicleName ?? 'Saloon'
    downloadCsv('fixed-price-template.csv', CSV_HEADER, [['LU1 3QF', 'heathrow', 45, exampleVehicleName]])
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
      const rows = await parseCsvFile(file)
      const result = await importMutation.mutateAsync(rows)

      if (result.errors.length === 0) {
        setSuccessMessage(`${result.addedCount} fixed price${result.addedCount === 1 ? '' : 's'} imported`)
      } else {
        // Errors list can be long, so it goes in a modal rather than a one-line alert
        setImportResult(result)
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'The file could not be imported. Please try again.')
    }
  }

  const hasFixedPrices = fixedPricesQuery.isSuccess && fixedPricesQuery.data.length > 0

  // Works out what the main part of the page should show
  function renderFixedPrices() {
    if (fixedPricesQuery.isPending) {
      return <div className="mt-8 h-64 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (fixedPricesQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Fixed prices could not be loaded" description={fixedPricesQuery.error.message} />
          <Button variant="secondary" onClick={() => fixedPricesQuery.refetch()} isLoading={fixedPricesQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (fixedPricesQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={Banknote}
          title="No fixed prices yet"
          description="Fixed prices override the mileage rate for a journey."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add fixed price
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <FixedPricesTable fixedPrices={fixedPricesQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Fixed Price Setting"
        description="Set fixed prices for journeys between a pickup postcode and a drop-off keyword."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              ref={importFileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportFileSelected}
              className="hidden"
            />
            <Button variant="secondary" icon={FileDown} onClick={downloadTemplate}>
              Download template
            </Button>
            <Button variant="secondary" icon={Upload} onClick={openImportFilePicker} isLoading={importMutation.isPending}>
              Import CSV
            </Button>
            <Button variant="secondary" icon={Download} onClick={exportCsv} disabled={!hasFixedPrices}>
              Export CSV
            </Button>
            {hasFixedPrices && (
              <Button variant="secondary" icon={Trash2} onClick={openDeleteAllDialog} className="text-danger hover:bg-danger-soft">
                Delete all
              </Button>
            )}
            <Button icon={Plus} onClick={openAddModal}>
              Add fixed price
            </Button>
          </div>
        }
      />

      <p className="mt-6 text-sm text-muted">
        CSV format: either columns <span className="font-medium text-ink">pickup, drop_code, fare, vehicle</span> (one row per
        vehicle), or <span className="font-medium text-ink">pickup, drop_code</span> plus one fare column per vehicle (e.g.{' '}
        <span className="font-medium text-ink">saloon_fare, estate_fare</span>) — matched to your vehicles by name. Leave a
        vehicle's column blank or 0 if it isn't offered on that route.
      </p>

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {importError && (
        <Alert
          variant="error"
          title="The file could not be imported"
          description={importError}
          onDismiss={() => setImportError(null)}
          className="mt-6"
        />
      )}

      {renderFixedPrices()}

      <AddFixedPriceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFixedPriceAdded={handleFixedPriceAdded}
      />

      <EditFixedPriceModal
        isOpen={fixedPriceToEdit !== null}
        onClose={() => setFixedPriceToEdit(null)}
        fixedPrice={fixedPriceToEdit}
        onSaved={handleFixedPriceSaved}
      />

      <ConfirmDeleteModal
        isOpen={fixedPriceToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete fixed price?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          The fixed price for <span className="font-semibold text-ink">{fixedPriceToDelete?.vehicleName}</span> on route{' '}
          <span className="font-semibold text-ink">
            {fixedPriceToDelete?.pickupPostcode} → {fixedPriceToDelete?.dropCode}
          </span>{' '}
          will be removed.
        </p>
      </ConfirmDeleteModal>

      <ConfirmDeleteModal
        isOpen={isDeleteAllModalOpen}
        onClose={closeDeleteAllDialog}
        onConfirm={confirmDeleteAll}
        title="Delete all fixed prices?"
        confirmLabel="Delete all"
        isDeleting={deleteAllMutation.isPending}
        errorMessage={deleteAllMutation.isError ? deleteAllMutation.error.message : null}
      >
        <p>Every fixed-price route will be removed. This cannot be undone.</p>
      </ConfirmDeleteModal>

      {importResult && (
        <ImportResultModal
          isOpen
          onClose={() => setImportResult(null)}
          addedCount={importResult.addedCount}
          errors={importResult.errors}
          itemLabel="fixed price"
        />
      )}
    </>
  )
}
