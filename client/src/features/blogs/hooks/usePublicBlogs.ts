import { useQuery } from '@tanstack/react-query'
import { getPublicBlogBySlug, getPublicBlogs } from '../api/blogsApi'

// Blogs change rarely, so React Query keeps them for 5 minutes before asking again
const FIVE_MINUTES = 5 * 60 * 1000

// The published blogs (home page section and the blogs page)
export function usePublicBlogs() {
  return useQuery({
    queryKey: ['public-blogs'],
    queryFn: getPublicBlogs,
    staleTime: FIVE_MINUTES,
  })
}

// One blog, for its page. A missing blog (404) is not retried.
export function usePublicBlog(slug: string) {
  return useQuery({
    queryKey: ['public-blog', slug],
    queryFn: () => getPublicBlogBySlug(slug),
    enabled: slug !== '',
    staleTime: FIVE_MINUTES,
    retry: false,
  })
}
