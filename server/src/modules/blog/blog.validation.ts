// Blog ke input ko check karne wali Zod rules
import { z } from "zod";

// Itne characters ka HTML kaafi hai (lagbhag 30,000+ words ka blog)
export const MAX_BLOG_CONTENT_LENGTH = 300000;
export const MAX_BLOG_TAGS = 15;

// Form data me sab kuch text aata hai. stringbool "true"/"false" ko asli true/false bana deta hai
const trueOrFalse = z.stringbool().default(false);

const blogFields = {
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title must be 200 characters or fewer"),
  slug: z.string().trim().max(200, "URL slug must be 200 characters or fewer").default(""),
  excerpt: z.string().trim().max(300, "Excerpt must be 300 characters or fewer").default(""),
  content: z.string().max(MAX_BLOG_CONTENT_LENGTH, "Blog content is too long"),
  category: z.string().trim().max(60, "Category must be 60 characters or fewer").default(""),
  // Form data me tags "tags[]" naam se aate hain
  tags: z
    .array(z.string().trim().min(1).max(40, "Each tag must be 40 characters or fewer"))
    .max(MAX_BLOG_TAGS, "Use up to " + MAX_BLOG_TAGS + " tags")
    .default([]),
  authorName: z.string().trim().max(80, "Author name must be 80 characters or fewer").default(""),
  status: z.enum(["draft", "published"], "Choose draft or published"),
  isFeatured: trueOrFalse,
  metaTitle: z.string().trim().max(70, "Meta title must be 70 characters or fewer").default(""),
  metaDescription: z.string().trim().max(170, "Meta description must be 170 characters or fewer").default(""),
};

export const createBlogSchema = z.object(blogFields);

// Edit me "removeCoverImage" bhi aa sakta hai (purani cover image hatani ho to "true")
export const updateBlogSchema = z.object({
  ...blogFields,
  removeCoverImage: trueOrFalse,
});
