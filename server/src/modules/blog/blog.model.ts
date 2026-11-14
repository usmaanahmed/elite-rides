// Blog ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    // URL ka hissa, har blog ka alag hota hai
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "", trim: true },
    // Rich text editor ka saaf (sanitize) kiya hua HTML
    content: { type: String, required: true },
    coverImageFileName: { type: String, default: null },
    category: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    authorName: { type: String, default: "", trim: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    readingTimeMinutes: { type: Number, default: 1 },
    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const Blog = model("Blog", blogSchema);
