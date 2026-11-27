import { Newspaper } from 'lucide-react'
import { useEffect } from 'react'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import { SiteFooter } from '../../../shared/components/layout/footer/SiteFooter'
import { SiteHeader } from '../../../shared/components/layout/SiteHeader'
import { COMPANY } from '../../../shared/constants/company'
import { AirportDetailsSkeleton } from '../../airports/components/details/AirportDetailsSkeleton'
import { BlogsList } from '../components/BlogsList'
import { usePublicBlogs } from '../hooks/usePublicBlogs'

// The blogs page (/blogs): every published blog, newest first
export function BlogsPage() {
  const blogsQuery = usePublicBlogs()

  // Start at the top of the page, and set the browser tab title
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const previousTitle = document.title
    document.title = `Blogs | ${COMPANY.name}`
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="relative isolate min-h-svh overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-56 -top-56 size-[680px] rounded-full bg-accent/12 blur-[150px]" />
        <div className="map-grid absolute inset-x-0 top-0 h-[700px]" />
      </div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pb-32">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
          <span className="h-px w-8 bg-accent" />
          Our blog
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl">
          Travel tips and news.
        </h1>

        <div className="mt-12 lg:mt-16">
          {blogsQuery.isPending && <AirportDetailsSkeleton />}
          {blogsQuery.isError && (
            <SectionNotice
              icon={Newspaper}
              title="We couldn't load our blogs just now"
              message="Please try again in a moment."
              onRetry={() => blogsQuery.refetch()}
            />
          )}
          {blogsQuery.isSuccess && <BlogsList blogs={blogsQuery.data} />}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
