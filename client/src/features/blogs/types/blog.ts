// A blog as the website gets it from GET /api/public/blogs (the list has no content)
export type PublicBlog = {
  id: string
  title: string
  // Last part of the blog's link, e.g. "heathrow-airport-tips"
  slug: string
  // Short summary shown on the cards
  excerpt: string
  // e.g. "/uploads/blogs/1700000000-123.jpg" (use getFileUrl). null when the blog has no cover.
  coverImageUrl: string | null
  category: string
  tags: string[]
  authorName: string
  // Date as text, e.g. "2026-11-27T10:00:00.000Z"
  publishedAt: string | null
  readingTimeMinutes: number
  metaTitle: string
  metaDescription: string
}

// One blog with its full text, from GET /api/public/blogs/:slug
export type PublicBlogDetails = PublicBlog & {
  // Clean HTML written in the admin's editor (the server already removed anything unsafe)
  content: string
}
