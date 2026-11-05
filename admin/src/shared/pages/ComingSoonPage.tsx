import { Construction } from 'lucide-react'
import { EmptyStateCard } from '../components/cards/EmptyStateCard'
import { PageHeader } from '../components/PageHeader'

type ComingSoonPageProps = {
  title: string
}

// Stand-in for pages that have a route but are not built yet
export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <>
      <PageHeader title={title} description={`The ${title.toLowerCase()} page is on its way.`} />

      <EmptyStateCard
        icon={Construction}
        title="Coming soon"
        description="This section is still being built."
        className="mt-8"
      />
    </>
  )
}
