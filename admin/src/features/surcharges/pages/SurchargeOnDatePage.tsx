import { CalendarClock, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddSurchargeDateModal } from '../components/AddSurchargeDateModal'
import type { NewSurchargeDate } from '../types/surchargeDate'

// Turns "2026-12-25" into "25 Dec 2026".
// The "T00:00" makes it local midnight; on its own the date would be read as UTC and could show the day before.
function formatDate(date: string): string {
  return new Date(`${date}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function SurchargeOnDatePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Text of the success message after a surcharge is added (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleSurchargeDateAdded(surchargeDate: NewSurchargeDate) {
    setSuccessMessage(
      `${surchargeDate.surchargePercent}% surcharge added for ${formatDate(surchargeDate.date)} from ${surchargeDate.fromTime} to ${surchargeDate.toTime}`,
    )
  }

  return (
    <>
      <PageHeader
        title="Surcharge On Date"
        description="Extra charges added for bookings on certain dates."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add surcharge
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      <EmptyStateCard
        icon={CalendarClock}
        title="No date surcharges yet"
        description="Add a date, such as a public holiday, to charge extra on it."
        action={
          <Button variant="secondary" icon={Plus} onClick={openAddModal}>
            Add surcharge
          </Button>
        }
        className="mt-8"
      />

      <AddSurchargeDateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSurchargeDateAdded={handleSurchargeDateAdded}
      />
    </>
  )
}
