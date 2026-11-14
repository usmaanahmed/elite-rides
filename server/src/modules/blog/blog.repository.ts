// Blog ke database queries (sirf queries, koi business logic nahi)
import { Blog } from "./blog.model.js";
import { BlogSaveData } from "./blog.types.js";

// Saare blogs, naye sab se upar. Content list me nahi chahiye, is liye chhor do
export function findAllBlogs() {
  return Blog.find().select("-content").sort({ createdAt: -1 }).lean();
}

export function findBlogById(id: string) {
  return Blog.findById(id).lean();
}

export function findBlogBySlug(slug: string) {
  return Blog.findOne({ slug: slug }).lean();
}

export function createBlog(data: BlogSaveData) {
  return Blog.create(data);
}

export function updateBlogById(id: string, data: BlogSaveData) {
  return Blog.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteBlogById(id: string) {
  return Blog.findByIdAndDelete(id).lean();
}

// Kya yeh image kisi doosre blog me bhi lagi hai? (e.g. admin ne content copy-paste kiya ho)
export function findOtherBlogUsingImage(fileName: string, blogId: string) {
  // File name ka "." regex me "koi bhi character" hota hai, is liye usay "\." bana do
  const fileNamePattern = fileName.replaceAll(".", "\\.");

  return Blog.exists({
    _id: { $ne: blogId },
    $or: [{ coverImageFileName: fileName }, { content: { $regex: fileNamePattern } }],
  });
}
