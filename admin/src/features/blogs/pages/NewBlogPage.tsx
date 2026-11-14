import { useNavigate } from 'react-router'
import { ROUTES } from '../../../shared/constants/routes'
import { BlogForm } from '../components/BlogForm'
import { useBlogs } from '../hooks/useBlogs'
import type { Blog } from '../types/blog'
import { getBlogCategories } from '../utils/getBlogCategories'

// Page for writing a new blog
export function NewBlogPage() {
  const navigate = useNavigate()
  // Only used to suggest the categories other blogs already use
  const blogsQuery = useBlogs()

  let categorySuggestions: string[] = []
  if (blogsQuery.data) {
    categorySuggestions = getBlogCategories(blogsQuery.data)
  }

  // Go back to the list and show a success message there
  function handleSaved(blog: Blog) {
    let message = `"${blog.title}" was saved as a draft`
    if (blog.status === 'published') {
      message = `"${blog.title}" was published`
    }
    navigate(ROUTES.blogs, { state: { successMessage: message } })
  }

  return <BlogForm blogToEdit={null} categorySuggestions={categorySuggestions} onSaved={handleSaved} />
}
