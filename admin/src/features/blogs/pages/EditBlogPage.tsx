import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { ROUTES } from '../../../shared/constants/routes'
import { BlogForm } from '../components/BlogForm'
import { useBlog, useBlogs } from '../hooks/useBlogs'
import type { Blog } from '../types/blog'
import { getBlogCategories } from '../utils/getBlogCategories'

// Page for editing an existing blog. The blog id comes from the URL: /blogs/:blogId/edit
export function EditBlogPage() {
  const navigate = useNavigate()
  const params = useParams()
  const blogId = params.blogId ?? ''

  const blogQuery = useBlog(blogId)
  // Only used to suggest the categories other blogs already use
  const blogsQuery = useBlogs()

  let categorySuggestions: string[] = []
  if (blogsQuery.data) {
    categorySuggestions = getBlogCategories(blogsQuery.data)
  }

  // Go back to the list and show a success message there
  function handleSaved(blog: Blog) {
    navigate(ROUTES.blogs, { state: { successMessage: `"${blog.title}" was updated` } })
  }

  // Show the form as soon as the blog is loaded. A later background refresh failing
  // must not replace the form (and the admin's unsaved changes) with an error.
  if (blogQuery.data) {
    return (
      <BlogForm
        key={blogQuery.data.id}
        blogToEdit={blogQuery.data}
        categorySuggestions={categorySuggestions}
        onSaved={handleSaved}
      />
    )
  }

  const backLink = (
    <Link
      to={ROUTES.blogs}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
    >
      <ArrowLeft className="size-4" strokeWidth={2} />
      Back to blogs
    </Link>
  )

  if (blogQuery.isError) {
    return (
      <>
        <PageHeader title="Edit blog" actions={backLink} />
        <Alert variant="error" title="This blog could not be loaded" description={blogQuery.error.message} className="mt-8" />
      </>
    )
  }

  // Still loading
  return (
    <>
      <PageHeader title="Edit blog" actions={backLink} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="h-[560px] animate-pulse rounded-2xl bg-surface-muted" />
        <div className="h-80 animate-pulse rounded-2xl bg-surface-muted" />
      </div>
    </>
  )
}
