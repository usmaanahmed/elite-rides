import type { BlogFilterValues, BlogListItem } from '../types/blog'

// Keeps only the blogs that match the filter bar (status and category)
export function filterBlogs(blogs: BlogListItem[], filters: BlogFilterValues): BlogListItem[] {
  const matches: BlogListItem[] = []

  for (const blog of blogs) {
    if (filters.status !== 'all' && blog.status !== filters.status) {
      continue
    }
    if (filters.category !== '' && blog.category !== filters.category) {
      continue
    }
    matches.push(blog)
  }
  return matches
}
