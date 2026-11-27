import { Newspaper } from 'lucide-react'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import type { PublicBlog } from '../types/blog'
import { BlogCard } from './BlogCard'

type BlogsListProps = {
  blogs: PublicBlog[]
}

// A grid of blog cards (used on the home page and on the blogs page)
export function BlogsList({ blogs }: BlogsListProps) {
  if (blogs.length === 0) {
    return (
      <SectionNotice
        icon={Newspaper}
        title="No blogs yet"
        message="We have not published anything yet. Please check back soon."
      />
    )
  }

  return (
    <ul aria-label="Our blogs" className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {blogs.map((blog) => (
        <li key={blog.id}>
          <BlogCard blog={blog} />
        </li>
      ))}
    </ul>
  )
}
