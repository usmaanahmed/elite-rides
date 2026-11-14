import { apiFetch } from '../../../shared/api/apiFetch'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Blog, BlogListItem, NewBlog, UploadedBlogImage } from '../types/blog'
import { toShortImageLinks, withFullBlogUrls, withFullCoverUrl } from '../utils/blogImageLinks'

// The cover image means the blog has to be sent as FormData instead of JSON
function buildFormData(blog: NewBlog): FormData {
  const formData = new FormData()
  formData.append('title', blog.title)
  formData.append('slug', blog.slug)
  formData.append('excerpt', blog.excerpt)
  formData.append('content', toShortImageLinks(blog.content))
  formData.append('category', blog.category)
  formData.append('authorName', blog.authorName)
  formData.append('status', blog.status)
  formData.append('isFeatured', String(blog.isFeatured))
  formData.append('metaTitle', blog.metaTitle)
  formData.append('metaDescription', blog.metaDescription)
  formData.append('removeCoverImage', String(blog.removeCoverImage))

  // The "[]" tells the server this field is a list, even when it holds only one tag
  for (const tag of blog.tags) {
    formData.append('tags[]', tag)
  }
  if (blog.coverImage) {
    formData.append('coverImage', blog.coverImage)
  }
  return formData
}

// Loads all blogs (without their content)
export async function getBlogs(): Promise<BlogListItem[]> {
  const response = await apiFetch('/blogs')
  const blogs = (await readJsonResponse(response)) as BlogListItem[]
  return blogs.map(withFullCoverUrl)
}

// Loads one blog with its content, for the edit page
export async function getBlog(blogId: string): Promise<Blog> {
  const response = await apiFetch(`/blogs/${blogId}`)
  const blog = (await readJsonResponse(response)) as Blog
  return withFullBlogUrls(blog)
}

// Saves a new blog
export async function addBlog(blog: NewBlog): Promise<Blog> {
  const response = await apiFetch('/blogs', { method: 'POST', body: buildFormData(blog) })
  const savedBlog = (await readJsonResponse(response)) as Blog
  return withFullBlogUrls(savedBlog)
}

// Saves changes to an existing blog
export async function editBlog(blogId: string, blog: NewBlog): Promise<Blog> {
  const response = await apiFetch(`/blogs/${blogId}`, { method: 'PUT', body: buildFormData(blog) })
  const savedBlog = (await readJsonResponse(response)) as Blog
  return withFullBlogUrls(savedBlog)
}

// Deletes a blog (and its images)
export async function deleteBlog(blogId: string): Promise<void> {
  const response = await apiFetch(`/blogs/${blogId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}

// Uploads one image from the editor straight away and gives back its full link
export async function uploadBlogImage(file: File): Promise<UploadedBlogImage> {
  const formData = new FormData()
  formData.append('image', file)

  const response = await apiFetch('/blogs/content-images', { method: 'POST', body: formData })
  const image = (await readJsonResponse(response)) as UploadedBlogImage
  return { fileName: image.fileName, url: getFileUrl(image.url) ?? image.url }
}
