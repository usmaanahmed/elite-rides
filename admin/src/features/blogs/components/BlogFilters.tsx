import { X } from 'lucide-react'
import { Button } from '../../../shared/components/buttons/Button'
import { SegmentedControl } from '../../../shared/components/inputs/SegmentedControl'
import { SelectInput, type SelectOption } from '../../../shared/components/inputs/SelectInput'
import type { BlogFilterValues, BlogListItem, BlogStatusFilter } from '../types/blog'

type BlogFiltersProps = {
  // All blogs (used for the counts on the status buttons)
  blogs: BlogListItem[]
  categories: string[]
  filters: BlogFilterValues
  onChange: (filters: BlogFilterValues) => void
  onClear: () => void
}

// How many blogs have the given status
function countBlogs(blogs: BlogListItem[], status: BlogStatusFilter): number {
  if (status === 'all') {
    return blogs.length
  }

  let count = 0
  for (const blog of blogs) {
    if (blog.status === status) {
      count = count + 1
    }
  }
  return count
}

// The filter bar above the blogs table: status (with counts) and category
export function BlogFilters({ blogs, categories, filters, onChange, onClear }: BlogFiltersProps) {
  const statusOptions = [
    { value: 'all', label: `All (${countBlogs(blogs, 'all')})` },
    { value: 'published', label: `Published (${countBlogs(blogs, 'published')})` },
    { value: 'draft', label: `Drafts (${countBlogs(blogs, 'draft')})` },
  ]

  const categoryOptions: SelectOption[] = [{ value: '', label: 'All categories' }]
  for (const category of categories) {
    categoryOptions.push({ value: category, label: category })
  }

  const hasActiveFilter = filters.status !== 'all' || filters.category !== ''

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SegmentedControl
        label="Filter by status"
        options={statusOptions}
        value={filters.status}
        onChange={(value) => onChange({ ...filters, status: value as BlogStatusFilter })}
        // A fixed width keeps labels like "Published (12)" on one line
        className="w-full shrink-0 sm:w-96"
      />
      <div className="sm:w-56">
        <SelectInput
          aria-label="Filter by category"
          options={categoryOptions}
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
        />
      </div>
      {hasActiveFilter && (
        <Button variant="secondary" icon={X} onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  )
}
