// Link to a blog's page, e.g. "/blogs/heathrow-airport-tips"
export function buildBlogLink(slug: string): string {
  return '/blogs/' + encodeURIComponent(slug)
}
