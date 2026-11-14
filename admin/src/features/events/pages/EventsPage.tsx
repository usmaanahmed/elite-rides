import { PartyPopper, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { EventFilters } from '../components/EventFilters'
import { EventModal } from '../components/EventModal'
import { EventsTable } from '../components/EventsTable'
import { useEvents, useDeleteEvent } from '../hooks/useEvents'
import type { EventItem, EventFilterValues } from '../types/event'
import { filterEvents } from '../utils/filterEvents'

const emptyFilters: EventFilterValues = { name: '', images: 'all' }

// The Events page: a table of all events with add, edit and delete
export function EventsPage() {
  // The events from the server (React Query keeps it cached and up to date)
  const eventsQuery = useEvents()
  const deleteMutation = useDeleteEvent()

  const [filters, setFilters] = useState<EventFilterValues>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // The event open in the modal for editing (null = the modal adds a new event)
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null)
  // The event waiting for the user to confirm its deletion (null = no dialog)
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setEventToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(event: EventItem) {
    setSuccessMessage(null)
    setEventToEdit(event)
    setIsModalOpen(true)
  }

  function handleEventSaved(event: EventItem, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`"${event.name}" was updated`)
    } else {
      setSuccessMessage(`"${event.name}" was added`)
    }
  }

  function openDeleteDialog(event: EventItem) {
    deleteMutation.reset()
    setEventToDelete(event)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setEventToDelete(null)
  }

  async function confirmDelete() {
    if (!eventToDelete) return

    try {
      await deleteMutation.mutateAsync(eventToDelete.id)
      setSuccessMessage(`"${eventToDelete.name}" was deleted`)
      setEventToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderEvents() {
    if (eventsQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (eventsQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Events could not be loaded" description={eventsQuery.error.message} />
          <Button variant="secondary" onClick={() => eventsQuery.refetch()} isLoading={eventsQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (eventsQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={PartyPopper}
          title="No events yet"
          description="Add an event with its description and photos."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add event
            </Button>
          }
          className="mt-8"
        />
      )
    }

    const filteredEvents = filterEvents(eventsQuery.data, filters)

    return (
      <>
        <EventFilters filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />
        <div className="mt-4">
          <EventsTable events={filteredEvents} onEdit={openEditModal} onDelete={openDeleteDialog} />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Events"
        description="Events with their description and photos."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add event
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderEvents()}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventToEdit={eventToEdit}
        onSaved={handleEventSaved}
      />

      <ConfirmDeleteModal
        isOpen={eventToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete event?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{eventToDelete?.name}</span> and all its images will be deleted.
          This cannot be undone.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
