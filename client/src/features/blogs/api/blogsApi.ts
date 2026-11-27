import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { PublicBlog, PublicBlogDetails } from '../types/blog'

// Loads the published blogs (newest first, without the full text)
export async function getPublicBlogs(): Promise<PublicBlog[]> {
  const response = await fetch(`${API_URL}/public/blogs`)
  return (await readJsonResponse(response)) as PublicBlog[]
}

// Loads one published blog with its full text
export async function getPublicBlogBySlug(slug: string): Promise<PublicBlogDetails> {
  const response = await fetch(`${API_URL}/public/blogs/${encodeURIComponent(slug)}`)
  return (await readJsonResponse(response)) as PublicBlogDetails
}
