import { ArrowRight, Newspaper } from 'lucide-react'
import { Link } from 'react-router'
import { getFileUrl } from '../../../shared/api/apiUrl'
import type { PublicBlog } from '../types/blog'
import { buildBlogLink } from '../utils/buildBlogLink'
import { formatBlogDate } from '../utils/formatBlogDate'

type BlogCardProps = {
  blog: PublicBlog
}

// Top of a blog card: the cover image, or a dark panel with an icon if the blog has no cover
function BlogCardCover({ blog }: BlogCardProps) {
  if (blog.coverImageUrl === null) {
    return (
      <div aria-hidden="true" className="grid aspect-16/10 place-items-center bg-night">
        <Newspaper className="size-12 text-white/15" strokeWidth={1} />
      </div>
    )
  }

  return (
    <img
      src={getFileUrl(blog.coverImageUrl)}
      alt=""
      loading="lazy"
      decoding="async"
      className="aspect-16/10 w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
    />
  )
}

// One blog: cover image, category, title, short summary, date and reading time.
// The whole card is one link (the link stretches over the card with `after:absolute after:inset-0`).
export function BlogCard({ blog }: BlogCardProps) {
  const dateText = formatBlogDate(blog.publishedAt)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/10 transition duration-500 ease-out hover:-translate-y-1 hover:ring-white/25 has-focus-visible:ring-2 has-focus-visible:ring-accent">
      <div className="overflow-hidden">
        <BlogCardCover blog={blog} />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {blog.category && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-bright">{blog.category}</p>
        )}

        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-white">{blog.title}</h3>

        {blog.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{blog.excerpt}</p>}

        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
          <span className="text-white/45">
            {dateText}
            {dateText && ' · '}
            {blog.readingTimeMinutes} min read
          </span>
          <Link
            to={buildBlogLink(blog.slug)}
            className="inline-flex items-center gap-2 font-semibold text-white after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none"
          >
            <span>
              Read
              <span className="sr-only">: {blog.title}</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}
