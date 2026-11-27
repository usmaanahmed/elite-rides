import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '../../../shared/constants/routes'
import { usePublicBlogs } from '../hooks/usePublicBlogs'
import { BlogsList } from './BlogsList'

// How many of the newest blogs the home page shows (all of them are on the blogs page)
const HOME_BLOG_COUNT = 3

// "Blogs" section on the home page (the menu's "Blogs" link opens the full blogs page).
// It stays hidden while loading, on an error and when there are no blogs, so the page has no empty gap.
export function BlogsSection() {
  const blogsQuery = usePublicBlogs()

  if (blogsQuery.isPending || blogsQuery.isError || blogsQuery.data.length === 0) {
    return null
  }

  const newestBlogs = blogsQuery.data.slice(0, HOME_BLOG_COUNT)

  return (
    <section
      id="blogs"
      aria-labelledby="blogs-heading"
      className="relative isolate overflow-hidden border-t border-white/10 py-24 sm:py-28 lg:py-32"
    >
      {/* Soft glow behind the cards (decoration only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-48 top-1/4 size-[560px] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
              <span className="h-px w-8 bg-accent" />
              Our blog
            </p>
            <h2
              id="blogs-heading"
              className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
            >
              Travel tips and news.
            </h2>
          </div>

          <Link
            to={ROUTES.blogs}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            View all blogs
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-14 lg:mt-16">
          <BlogsList blogs={newestBlogs} />
        </div>
      </div>
    </section>
  )
}
