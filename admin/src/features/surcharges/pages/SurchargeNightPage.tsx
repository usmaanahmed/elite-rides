import { Alert } from '../../../shared/components/feedback/Alert'
import { Button } from '../../../shared/components/buttons/Button'
import { PageHeader } from '../../../shared/components/PageHeader'
import { SurchargeNightForm } from '../components/SurchargeNightForm'
import { useSurchargeNight } from '../hooks/useSurchargeNight'

export function SurchargeNightPage() {
  // The night surcharge from the server (React Query keeps it cached and up to date)
  const nightQuery = useSurchargeNight()

  // Works out what the main part of the page should show
  function renderContent() {
    if (nightQuery.isPending) {
      return <div className="mt-8 h-64 max-w-2xl animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (nightQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Night surcharge could not be loaded" description={nightQuery.error.message} />
          <Button variant="secondary" onClick={() => nightQuery.refetch()} isLoading={nightQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    return <SurchargeNightForm surchargeNight={nightQuery.data} />
  }

  return (
    <>
      <PageHeader
        title="Surcharge Night"
        description="One extra charge added to every booking whose pickup time falls in the night window."
      />

      {renderContent()}
    </>
  )
}
