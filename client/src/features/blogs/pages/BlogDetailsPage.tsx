import { ChevronRight, Newspaper } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import { SiteFooter } from '../../../shared/components/layout/footer/SiteFooter'
import { SiteHeader } from '../../../shared/components/layout/SiteHeader'
import { COMPANY } from '../../../shared/constants/company'
import { ROUTES } from '../../../shared/constants/routes'
import { AirportDetailsSkeleton } from '../../airports/components/details/AirportDetailsSkeleton'
import { usePublicBlog } from '../hooks/usePublicBlogs'
import type { PublicBlogDetails } from '../types/blog'
import { formatBlogDate } from '../utils/formatBlogDate'

// Page for one blog (/blogs/:slug), opened from the blog cards
export function BlogDetailsPage() {
  const params = useParams()
  const slug = params.slug || ''

  // Start at the top of the page when opening a blog
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  return (
    <div className="relative isolate min-h-svh overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-56 -top-56 size-[680px] rounded-full bg-accent/12 blur-[150px]" />
        <div className="map-grid absolute inset-x-0 top-0 h-[700px]" />
      </div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-32">
        <BlogDetailsContent slug={slug} />
      </main>
      <SiteFooter />
    </div>
  )
}

type BlogDetailsContentProps = {
  slug: string
}

// Picks what to show: placeholder while loading, a message if the blog can't be found, otherwise the blog
function BlogDetailsContent({ slug }: BlogDetailsContentProps) {
  const blogQuery = usePublicBlog(slug)

  if (blogQuery.isPending) {
    return <AirportDetailsSkeleton />
  }

  if (blogQuery.isError) {
    return (
      <div className="mt-10">
        <SectionNotice
          icon={Newspaper}
          title="We couldn't find this blog"
          message="It may have been removed, or the connection dropped. Please try again."
          onRetry={() => blogQuery.refetch()}
        />
      </div>
    )
  }

  return <BlogDetails blog={blogQuery.data} />
}

type BlogDetailsProps = {
  blog: PublicBlogDetails
}

// The loaded blog: breadcrumbs, title, details line, cover image and the text
function BlogDetails({ blog }: BlogDetailsProps) {
  const dateText = formatBlogDate(blog.publishedAt)

  // Browser tab title, e.g. "Heathrow tips | Elite Rides" (the SEO title is used when the office wrote one)
  useEffect(() => {
    const previousTitle = document.title
    const pageTitle = blog.metaTitle || blog.title
    document.title = `${pageTitle} | ${COMPANY.name}`
    return () => {
      document.title = previousTitle
    }
  }, [blog.metaTitle, blog.title])

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/45">
          <li>
            <Link to={ROUTES.home} className="transition-colors hover:text-white">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" strokeWidth={2} />
          </li>
          <li>
            <Link to={ROUTES.blogs} className="transition-colors hover:text-white">
              Blogs
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" strokeWidth={2} />
          </li>
          <li aria-current="page" className="truncate font-medium text-white/80">
            {blog.title}
          </li>
        </ol>
      </nav>

      <header className="mt-10 motion-safe:animate-rise-in">
        {blog.category && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">{blog.category}</p>
        )}
        <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
          {blog.title}
        </h1>
        <p className="mt-5 text-sm text-white/50">
          {blog.authorName && `By ${blog.authorName} · `}
          {dateText && `${dateText} · `}
          {blog.readingTimeMinutes} min read
        </p>
      </header>

      {blog.coverImageUrl && (
        <img
          src={getFileUrl(blog.coverImageUrl)}
          alt=""
          className="mt-10 aspect-16/9 w-full rounded-[28px] object-cover ring-1 ring-white/10"
        />
      )}

      {/* The text is HTML from the admin's editor. The server cleans it before saving, so it is safe to show. */}
      <div className="blog-content mt-10" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {blog.tags.length > 0 && (
        <ul aria-label="Tags" className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
          {blog.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
