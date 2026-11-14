// Draft = only the admin can see it, Published = ready to show on the website
export type BlogStatus = 'draft' | 'published'

// A blog as shown in the table. The server leaves out the content to keep the list light.
export type BlogListItem = {
  id: string
  title: string
  // The part of the web address, e.g. "heathrow-airport-tips"
  slug: string
  // Short summary shown on blog cards
  excerpt: string
  // Full link the <img> tag can load (null = no cover image)
  coverImageUrl: string | null
  category: string
  tags: string[]
  authorName: string
  status: BlogStatus
  isFeatured: boolean
  // ISO date text, e.g. "2026-11-14T10:00:00.000Z" (null = never published)
  publishedAt: string | null
  readingTimeMinutes: number
  metaTitle: string
  metaDescription: string
  createdAt: string
  updatedAt: string
}

// A full blog with its content (HTML from the rich text editor)
export type Blog = BlogListItem & {
  content: string
}

// A blog ready to be sent to the server
export type NewBlog = {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  authorName: string
  status: BlogStatus
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
  // A newly picked cover image (null = keep the current one, or none)
  coverImage: File | null
  // True when the admin removed the saved cover image (only used when editing)
  removeCoverImage: boolean
}

// The values exactly as they sit in the blog form
export type BlogFormValues = {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  authorName: string
  status: BlogStatus
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
  // The saved cover image's link (null = none, or the admin removed it)
  existingCoverUrl: string | null
  // A newly picked cover image that is not uploaded yet
  newCoverImage: File | null
}

// Which blogs the filter bar shows
export type BlogStatusFilter = 'all' | BlogStatus

// The values in the filter bar above the table
export type BlogFilterValues = {
  status: BlogStatusFilter
  // '' = every category
  category: string
}

// An image uploaded from inside the editor
export type UploadedBlogImage = {
  fileName: string
  // Full link the <img> tag can load
  url: string
}
