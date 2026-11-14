type BlogSeoPreviewProps = {
  title: string
  slug: string
  description: string
}

// A rough picture of how the blog may look in Google search results
export function BlogSeoPreview({ title, slug, description }: BlogSeoPreviewProps) {
  let shownTitle = title.trim()
  if (shownTitle === '') {
    shownTitle = 'Your blog title'
  }

  let shownDescription = description.trim()
  if (shownDescription === '') {
    shownDescription = 'Add a meta description or an excerpt to control the text shown here.'
  }

  let shownSlug = slug.trim()
  if (shownSlug === '') {
    shownSlug = 'your-blog-url'
  }

  return (
    <div className="rounded-xl border border-line bg-surface-muted p-3.5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Search result preview</p>
      <p className="truncate text-xs text-muted">› blog › {shownSlug}</p>
      <p className="mt-0.5 line-clamp-1 text-[17px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{shownTitle}</p>
      <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted">{shownDescription}</p>
    </div>
  )
}
