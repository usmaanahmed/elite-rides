import type { BlogListItem } from '../types/blog'

// Every category used by the blogs, once each and in A→Z order, e.g. ["Airports", "Travel tips"]
export function getBlogCategories(blogs: BlogListItem[]): string[] {
  const categories: string[] = []

  for (const blog of blogs) {
    if (blog.category !== '' && !categories.includes(blog.category)) {
      categories.push(blog.category)
    }
  }
  return categories.sort()
}
