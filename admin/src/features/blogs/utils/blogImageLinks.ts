import { getFileUrl } from '../../../shared/api/apiUrl'
import type { Blog, BlogListItem } from '../types/blog'

// Full address of the server's uploads folder, e.g. "http://localhost:5000/uploads/"
const FULL_UPLOADS_URL = getFileUrl('/uploads/') ?? '/uploads/'

// The server saves image links inside the content as short paths (src="/uploads/blogs/photo.jpg").
// The admin runs on a different address, so the editor needs the full link to show them.
export function toFullImageLinks(html: string): string {
  return html.replaceAll('src="/uploads/', `src="${FULL_UPLOADS_URL}`)
}

// The opposite of toFullImageLinks, used just before saving.
// Short paths keep working even if the server's address changes later.
export function toShortImageLinks(html: string): string {
  return html.replaceAll(`src="${FULL_UPLOADS_URL}`, 'src="/uploads/')
}

// Turns the cover image path from the server into a full link the <img> tag can load
export function withFullCoverUrl(blog: BlogListItem): BlogListItem {
  return { ...blog, coverImageUrl: getFileUrl(blog.coverImageUrl) }
}

// Same as withFullCoverUrl, plus full links for the images inside the content
export function withFullBlogUrls(blog: Blog): Blog {
  return {
    ...blog,
    coverImageUrl: getFileUrl(blog.coverImageUrl),
    content: toFullImageLinks(blog.content),
  }
}
