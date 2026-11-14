import { Newspaper, Plus } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { getEditBlogPath, ROUTES } from '../../../shared/constants/routes'
import { BlogFilters } from '../components/BlogFilters'
import { BlogsTable } from '../components/BlogsTable'
import { useBlogs, useDeleteBlog } from '../hooks/useBlogs'
import type { BlogFilterValues, BlogListItem } from '../types/blog'
import { filterBlogs } from '../utils/filterBlogs'
import { getBlogCategories } from '../utils/getBlogCategories'

const emptyFilters: BlogFilterValues = { status: 'all', category: '' }

// The list of all blogs with filters, a data table and delete
export function BlogsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // The blogs from the server (React Query keeps it cached and up to date)
  const blogsQuery = useBlogs()
  const deleteMutation = useDeleteBlog()

  const [filters, setFilters] = useState<BlogFilterValues>(emptyFilters)
  // The blog waiting for the user to confirm its deletion (null = no dialog)
  const [blogToDelete, setBlogToDelete] = useState<BlogListItem | null>(null)
  // The new/edit blog page sends a message here after saving
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as { successMessage?: string } | null)?.successMessage ?? null,
  )

  function openNewBlogPage() {
    navigate(ROUTES.newBlog)
  }

  function openEditBlogPage(blog: BlogListItem) {
    navigate(getEditBlogPath(blog.id))
  }

  function openDeleteDialog(blog: BlogListItem) {
    deleteMutation.reset()
    setBlogToDelete(blog)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setBlogToDelete(null)
  }

  async function confirmDelete() {
    if (!blogToDelete) return

    try {
      await deleteMutation.mutateAsync(blogToDelete.id)
      setSuccessMessage(`"${blogToDelete.title}" was deleted`)
      setBlogToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderBlogs() {
    if (blogsQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (blogsQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Blogs could not be loaded" description={blogsQuery.error.message} />
          <Button variant="secondary" onClick={() => blogsQuery.refetch()} isLoading={blogsQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (blogsQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={Newspaper}
          title="No blogs yet"
          description="Write your first blog post with images, videos and tables."
          action={
            <Button variant="secondary" icon={Plus} onClick={openNewBlogPage}>
              Write a blog
            </Button>
          }
          className="mt-8"
        />
      )
    }

    const filteredBlogs = filterBlogs(blogsQuery.data, filters)

    return (
      <>
        <BlogFilters
          blogs={blogsQuery.data}
          categories={getBlogCategories(blogsQuery.data)}
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(emptyFilters)}
        />
        <div className="mt-4">
          <BlogsTable blogs={filteredBlogs} onEdit={openEditBlogPage} onDelete={openDeleteDialog} />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Blogs"
        description="Write, publish and manage the blog posts for the website."
        actions={
          <Button icon={Plus} onClick={openNewBlogPage}>
            New blog
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderBlogs()}

      <ConfirmDeleteModal
        isOpen={blogToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete blog?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{blogToDelete?.title}</span> and all its images will be deleted. This
          cannot be undone.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
