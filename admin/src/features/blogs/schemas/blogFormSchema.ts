import { z } from 'zod'
import { getTextFromHtml } from '../utils/getTextFromHtml'

// Same limits as the server
export const TITLE_MAX_LENGTH = 200
export const SLUG_MAX_LENGTH = 200
export const EXCERPT_MAX_LENGTH = 300
export const CONTENT_MAX_LENGTH = 300000
export const CATEGORY_MAX_LENGTH = 60
export const AUTHOR_MAX_LENGTH = 80
export const TAG_MAX_LENGTH = 40
export const MAX_TAGS = 15
export const META_TITLE_MAX_LENGTH = 70
export const META_DESCRIPTION_MAX_LENGTH = 170
// Google usually shows about this many characters, so the counters warn after it
export const META_TITLE_IDEAL_LENGTH = 60
export const META_DESCRIPTION_IDEAL_LENGTH = 160

export const MAX_IMAGE_SIZE_MB = 2
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Lowercase letters and numbers with single dashes between them, e.g. "airport-tips-2026"
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

// True when the editor has some text, an image or a video (an empty editor still sends "<p></p>")
function hasContent(html: string): boolean {
  if (getTextFromHtml(html).trim() !== '') {
    return true
  }
  return html.includes('<img') || html.includes('<iframe')
}

export const blogFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Enter the blog title')
    .min(3, 'Title must be at least 3 characters')
    .max(TITLE_MAX_LENGTH, `Title must be ${TITLE_MAX_LENGTH} characters or fewer`),

  slug: z
    .string()
    .trim()
    .min(1, 'Enter the URL slug')
    .max(SLUG_MAX_LENGTH, `URL slug must be ${SLUG_MAX_LENGTH} characters or fewer`)
    .regex(SLUG_PATTERN, 'Use lowercase letters, numbers and dashes only, e.g. airport-tips'),

  excerpt: z
    .string()
    .trim()
    .max(EXCERPT_MAX_LENGTH, `Excerpt must be ${EXCERPT_MAX_LENGTH} characters or fewer`),

  content: z
    .string()
    .max(CONTENT_MAX_LENGTH, 'The blog content is too long')
    .refine(hasContent, 'Write the blog content'),

  category: z
    .string()
    .trim()
    .max(CATEGORY_MAX_LENGTH, `Category must be ${CATEGORY_MAX_LENGTH} characters or fewer`),

  tags: z.array(z.string()).max(MAX_TAGS, `Use up to ${MAX_TAGS} tags`),

  authorName: z
    .string()
    .trim()
    .max(AUTHOR_MAX_LENGTH, `Author name must be ${AUTHOR_MAX_LENGTH} characters or fewer`),

  status: z.enum(['draft', 'published']),

  isFeatured: z.boolean(),

  metaTitle: z
    .string()
    .trim()
    .max(META_TITLE_MAX_LENGTH, `Meta title must be ${META_TITLE_MAX_LENGTH} characters or fewer`),

  metaDescription: z
    .string()
    .trim()
    .max(META_DESCRIPTION_MAX_LENGTH, `Meta description must be ${META_DESCRIPTION_MAX_LENGTH} characters or fewer`),

  existingCoverUrl: z.string().nullable(),

  newCoverImage: z
    .instanceof(File)
    .nullable()
    .refine((file) => file === null || ALLOWED_IMAGE_TYPES.includes(file.type), 'Use a JPG, PNG or WEBP image')
    .refine((file) => file === null || file.size <= MAX_IMAGE_SIZE_BYTES, `The image must be ${MAX_IMAGE_SIZE_MB} MB or smaller`),
})
