// Blog module ke TypeScript types
import { Types } from "mongoose";

// Draft = sirf admin ko nazar aata hai, Published = website par dikhne ke liye tayyar
export type BlogStatus = "draft" | "published";

// Form se aane wali values (validation ke baad)
export interface BlogInput {
  title: string;
  // URL ka hissa, e.g. "heathrow-airport-tips". Khaali ho to title se banta hai
  slug: string;
  // Chhota sa khulasa jo list/cards me dikhta hai
  excerpt: string;
  // Rich text editor ka HTML
  content: string;
  category: string;
  tags: string[];
  authorName: string;
  status: BlogStatus;
  isFeatured: boolean;
  // Google search ke liye (SEO)
  metaTitle: string;
  metaDescription: string;
}

// Edit form me ek extra flag aata hai
export interface BlogUpdateInput extends BlogInput {
  // true = purani cover image hata do (chahe nayi image na di ho)
  removeCoverImage: boolean;
}

// Jo data database me save hota hai
export interface BlogSaveData extends BlogInput {
  // Sirf file ka naam, e.g. "1700000000-123.jpg"
  coverImageFileName: string | null;
  // Blog pehli dafa kab publish hua (draft ho to null)
  publishedAt: Date | null;
  readingTimeMinutes: number;
}

// Blog jaisa database se aata hai
export interface BlogRecord extends BlogSaveData {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Table/list ke liye blog (content ke baghair, taake list halki rahe)
export interface BlogListItemResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  // e.g. "/uploads/blogs/1700000000-123.jpg" (cover na ho to null)
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  authorName: string;
  status: BlogStatus;
  isFeatured: boolean;
  publishedAt: Date | null;
  readingTimeMinutes: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

// Poora blog, content ke saath (edit page ke liye)
export interface BlogResponse extends BlogListItemResponse {
  content: string;
}

// Editor me lagane ke liye upload ki hui image
export interface BlogImageResponse {
  fileName: string;
  // e.g. "/uploads/blogs/1700000000-123.jpg"
  url: string;
}
