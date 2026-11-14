import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addBlog, deleteBlog, editBlog, getBlog, getBlogs, uploadBlogImage } from '../api/blogsApi'
import type { NewBlog } from '../types/blog'

// The name React Query uses to store the blogs in its cache
export const BLOGS_QUERY_KEY = ['blogs']

// Loads the blog list. Gives back the list plus loading / error info.
export function useBlogs() {
  return useQuery({
    queryKey: BLOGS_QUERY_KEY,
    queryFn: getBlogs,
  })
}

// Loads one full blog (with content) for the edit page
export function useBlog(blogId: string) {
  return useQuery({
    queryKey: [...BLOGS_QUERY_KEY, blogId],
    queryFn: () => getBlog(blogId),
  })
}

// Saves a new blog, then reloads the list so the table shows it
export function useAddBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY }),
  })
}

// Saves changes to a blog, then reloads the list (and the saved blog)
export function useEditBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ blogId, blog }: { blogId: string; blog: NewBlog }) => editBlog(blogId, blog),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY }),
  })
}

// Deletes a blog, then reloads the list so the row disappears
export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY }),
  })
}

// Uploads an image picked inside the editor
export function useUploadBlogImage() {
  return useMutation({
    mutationFn: uploadBlogImage,
  })
}
