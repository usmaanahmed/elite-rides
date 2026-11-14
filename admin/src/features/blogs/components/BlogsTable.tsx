import { ImageOff, SquarePen, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import { getEditBlogPath } from '../../../shared/constants/routes'
import type { BlogListItem } from '../types/blog'
import { formatBlogDate } from '../utils/formatBlogDate'
import { BlogStatusBadge } from './BlogStatusBadge'

type BlogsTableProps = {
  blogs: BlogListItem[]
  onEdit: (blog: BlogListItem) => void
  onDelete: (blog: BlogListItem) => void
}

// How many tags a row shows before "+2 more"
const TAGS_SHOWN = 2

// The cover image thumbnail, or a grey box when there is none
function CoverThumbnail({ blog }: { blog: BlogListItem }) {
  if (!blog.coverImageUrl) {
    return (
      <span className="grid h-12 w-20 place-items-center rounded-lg border border-line bg-surface-muted text-muted">
        <ImageOff className="size-4" strokeWidth={1.75} />
      </span>
    )
  }
  return <img src={blog.coverImageUrl} alt={blog.title} className="h-12 w-20 rounded-lg border border-line object-cover" />
}

// The first few tags as small pills, then "+N"
function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return <span className="text-muted">—</span>
  }

  const shownTags = tags.slice(0, TAGS_SHOWN)
  const hiddenCount = tags.length - shownTags.length

  return (
    <div className="flex max-w-56 flex-wrap gap-1">
      {shownTags.map((tag) => (
        <span key={tag} className="whitespace-nowrap rounded-md bg-surface-muted px-1.5 py-0.5 text-xs text-muted ring-1 ring-line">
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="px-1 py-0.5 text-xs font-medium text-muted" title={tags.join(', ')}>
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}

// All blogs as a searchable, sortable table
export function BlogsTable({ blogs, onEdit, onDelete }: BlogsTableProps) {
  const columns: DataTableColumn<BlogListItem>[] = [
    {
      key: 'cover',
      header: 'Cover',
      render: (row) => <CoverThumbnail blog={row} />,
      className: 'w-28',
    },
    {
      key: 'title',
      header: 'Title',
      getValue: (row) => row.title,
      render: (row) => (
        <div className="min-w-56 max-w-sm">
          <div className="flex items-start gap-1.5">
            <Link to={getEditBlogPath(row.id)} className="line-clamp-2 font-semibold text-ink hover:text-accent-ink hover:underline">
              {row.title}
            </Link>
            {row.isFeatured && (
              <span title="Featured blog" className="mt-0.5 shrink-0">
                <Star className="size-3.5 fill-accent text-accent" strokeWidth={2} />
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            /blog/{row.slug} · {row.readingTimeMinutes} min read
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      getValue: (row) => row.category,
      render: (row) => {
        if (row.category === '') {
          return <span className="text-muted">—</span>
        }
        return (
          <span className="whitespace-nowrap rounded-lg bg-accent-soft px-2 py-1 text-xs font-medium text-accent-ink">
            {row.category}
          </span>
        )
      },
    },
    {
      key: 'tags',
      header: 'Tags',
      getValue: (row) => row.tags.join(', '),
      render: (row) => <TagList tags={row.tags} />,
    },
    {
      key: 'status',
      header: 'Status',
      getValue: (row) => row.status,
      // The badge, with the date it was first published under it
      render: (row) => (
        <div>
          <BlogStatusBadge status={row.status} />
          {row.publishedAt && (
            <p className="mt-1 whitespace-nowrap text-xs text-muted">{formatBlogDate(row.publishedAt)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      // ISO dates sort correctly as text
      getValue: (row) => row.updatedAt,
      render: (row) => <span className="whitespace-nowrap text-muted">{formatBlogDate(row.updatedAt)}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label={`Edit ${row.title}`} onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label={`Delete ${row.title}`} onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <DataTable
      rows={blogs}
      columns={columns}
      getRowKey={(row) => row.id}
      initialSort={{ columnKey: 'updatedAt', direction: 'desc' }}
      searchPlaceholder="Search blogs…"
    />
  )
}
