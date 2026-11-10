import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { PriceCheckerForm } from '../components/PriceCheckerForm'
import { QuoteResult } from '../components/QuoteResult'
import { useQuote } from '../hooks/useQuote'

export function PriceCheckerPage() {
  const quoteMutation = useQuote()

  return (
    <>
      <PageHeader
        title="Price Checker"
        description="Enter a journey to see what every vehicle would cost, with the full price breakdown."
      />

      <div className="mt-8 space-y-6">
        <PriceCheckerForm isLoading={quoteMutation.isPending} onSubmitQuote={(request) => quoteMutation.mutate(request)} />

        {quoteMutation.isError && (
          <Alert variant="error" title="Could not get a price" description={quoteMutation.error.message} />
        )}

        {quoteMutation.isSuccess && <QuoteResult quote={quoteMutation.data} />}
      </div>
    </>
  )
}
