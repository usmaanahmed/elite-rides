// Blog ki business logic
import { isValidObjectId } from "mongoose";
import path from "path";
import { blogImagesFolder } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { makeSlug } from "../../utils/makeSlug.js";
import {
  cleanBlogContent,
  getContentImageFileNames,
  getReadingTimeMinutes,
  hasBlogContent,
} from "./blog.content.js";
import {
  createBlog as saveBlog,
  deleteBlogById,
  findAllBlogs,
  findBlogById,
  findBlogBySlug,
  findOtherBlogUsingImage,
  updateBlogById,
} from "./blog.repository.js";
import {
  BlogImageResponse,
  BlogInput,
  BlogListItemResponse,
  BlogRecord,
  BlogResponse,
  BlogSaveData,
  BlogStatus,
  BlogUpdateInput,
} from "./blog.types.js";

const BLOG_IMAGES_URL = "/uploads/blogs/";

// Image ke file name se us ka URL banata hai (file na ho to null)
function getImageUrl(fileName: string | null): string | null {
  if (!fileName) {
    return null;
  }
  return BLOG_IMAGES_URL + fileName;
}

// Database wala blog table/list ke format me (content ke baghair)
function toBlogListItem(blog: BlogRecord): BlogListItemResponse {
  return {
    id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    coverImageUrl: getImageUrl(blog.coverImageFileName),
    category: blog.category,
    tags: blog.tags,
    authorName: blog.authorName,
    status: blog.status,
    isFeatured: blog.isFeatured,
    publishedAt: blog.publishedAt,
    readingTimeMinutes: blog.readingTimeMinutes,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}

// Database wala poora blog (content ke saath) frontend ke format me
function toBlogResponse(blog: BlogRecord): BlogResponse {
  return { ...toBlogListItem(blog), content: blog.content };
}

// Disk se blog images delete karta hai. Jo image kisi doosre blog me bhi lagi ho, usay nahi chhedta
async function deleteUnusedImages(fileNames: string[], blogId: string): Promise<void> {
  for (const fileName of fileNames) {
    const otherBlog = await findOtherBlogUsingImage(fileName, blogId);
    if (!otherBlog) {
      await deleteFile(path.join(blogImagesFolder, fileName));
    }
  }
}

// Ek hi tag do dafa na aaye (bare/chhote letters ka farq nahi dekha jaata)
function removeDuplicateTags(tags: string[]): string[] {
  const uniqueTags: string[] = [];
  const seenTags: string[] = [];

  for (const tag of tags) {
    const lowerCaseTag = tag.toLowerCase();
    if (!seenTags.includes(lowerCaseTag)) {
      seenTags.push(lowerCaseTag);
      uniqueTags.push(tag);
    }
  }
  return uniqueTags;
}

// Pehli dafa publish ho to aaj ki date. Pehle se published ho to wohi purani date. Draft par null
function getPublishedAt(status: BlogStatus, oldPublishedAt: Date | null): Date | null {
  if (status === "draft") {
    return null;
  }
  if (oldPublishedAt) {
    return oldPublishedAt;
  }
  return new Date();
}

// Slug bana kar check karta hai ke koi doosra blog yeh slug use to nahi kar raha
// currentBlogId = jo blog edit ho raha hai (naye blog ke liye null)
async function getFreeSlug(input: BlogInput, currentBlogId: string | null): Promise<string> {
  let slug = makeSlug(input.slug);
  if (slug === "") {
    slug = makeSlug(input.title);
  }
  if (slug === "") {
    throw new AppError("slug: Use English letters or numbers in the URL slug", 400);
  }

  const blogWithSameSlug = await findBlogBySlug(slug);
  if (blogWithSameSlug && blogWithSameSlug._id.toString() !== currentBlogId) {
    throw new AppError('slug: Another blog already uses the URL "' + slug + '". Please change it.', 400);
  }
  return slug;
}

// Form ki values se database me save hone wala data banata hai (HTML saaf, slug, reading time, publish date)
async function buildSaveData(
  input: BlogInput,
  coverImageFileName: string | null,
  oldPublishedAt: Date | null,
  currentBlogId: string | null
): Promise<BlogSaveData> {
  const content = cleanBlogContent(input.content);
  if (!hasBlogContent(content)) {
    throw new AppError("content: Write the blog content", 400);
  }

  const slug = await getFreeSlug(input, currentBlogId);

  return {
    title: input.title,
    slug: slug,
    excerpt: input.excerpt,
    content: content,
    category: input.category,
    tags: removeDuplicateTags(input.tags),
    authorName: input.authorName,
    status: input.status,
    isFeatured: input.isFeatured,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    coverImageFileName: coverImageFileName,
    publishedAt: getPublishedAt(input.status, oldPublishedAt),
    readingTimeMinutes: getReadingTimeMinutes(content),
  };
}

// Saare blogs (table ke liye)
export async function getAllBlogs(): Promise<BlogListItemResponse[]> {
  const blogs = await findAllBlogs();
  return blogs.map((blog) => toBlogListItem(blog as unknown as BlogRecord));
}

// Ek blog, content ke saath (edit page ke liye)
export async function getBlogById(id: string): Promise<BlogResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Blog not found", 404);
  }

  const blog = await findBlogById(id);
  if (!blog) {
    throw new AppError("Blog not found", 404);
  }
  return toBlogResponse(blog as unknown as BlogRecord);
}

// Naya blog banao. coverImageFileName = multer ki save ki hui cover image (na ho to null)
export async function createBlog(input: BlogInput, coverImageFileName: string | null): Promise<BlogResponse> {
  try {
    const saveData = await buildSaveData(input, coverImageFileName, null, null);
    const blog = await saveBlog(saveData);
    return toBlogResponse(blog.toObject() as unknown as BlogRecord);
  } catch (error) {
    // Blog save nahi hua to upload ho chuki cover image disk par bekaar na padi rahe
    if (coverImageFileName) {
      await deleteFile(path.join(blogImagesFolder, coverImageFileName));
    }
    throw error;
  }
}

// Blog edit karo. newCoverImageFileName = nayi cover image (na di ho to null)
export async function updateBlog(
  id: string,
  input: BlogUpdateInput,
  newCoverImageFileName: string | null
): Promise<BlogResponse> {
  let oldBlog: BlogRecord;
  let updatedBlog: BlogRecord;

  try {
    if (!isValidObjectId(id)) {
      throw new AppError("Blog not found", 404);
    }

    const existingBlog = await findBlogById(id);
    if (!existingBlog) {
      throw new AppError("Blog not found", 404);
    }
    oldBlog = existingBlog as unknown as BlogRecord;

    // Nayi cover aayi to wo, admin ne hatai to null, warna purani hi rahe
    let coverImageFileName = oldBlog.coverImageFileName;
    if (newCoverImageFileName) {
      coverImageFileName = newCoverImageFileName;
    } else if (input.removeCoverImage) {
      coverImageFileName = null;
    }

    const saveData = await buildSaveData(input, coverImageFileName, oldBlog.publishedAt, id);
    const savedBlog = await updateBlogById(id, saveData);
    if (!savedBlog) {
      throw new AppError("Blog not found", 404);
    }
    updatedBlog = savedBlog as unknown as BlogRecord;
  } catch (error) {
    // Kuch galat hua to nayi cover image disk se hata do
    if (newCoverImageFileName) {
      await deleteFile(path.join(blogImagesFolder, newCoverImageFileName));
    }
    throw error;
  }

  // Blog save ho gaya. Ab wo purani images hatao jo is blog me ab use nahi hotin
  const unusedFileNames: string[] = [];

  if (oldBlog.coverImageFileName && oldBlog.coverImageFileName !== updatedBlog.coverImageFileName) {
    unusedFileNames.push(oldBlog.coverImageFileName);
  }

  const newContentImages = getContentImageFileNames(updatedBlog.content);
  for (const fileName of getContentImageFileNames(oldBlog.content)) {
    if (!newContentImages.includes(fileName)) {
      unusedFileNames.push(fileName);
    }
  }

  await deleteUnusedImages(unusedFileNames, id);
  return toBlogResponse(updatedBlog);
}

// Blog aur us ki saari images (cover + content wali) delete karo
export async function deleteBlog(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Blog not found", 404);
  }

  const deletedBlog = await deleteBlogById(id);
  if (!deletedBlog) {
    throw new AppError("Blog not found", 404);
  }

  const fileNames = getContentImageFileNames(deletedBlog.content);
  if (deletedBlog.coverImageFileName) {
    fileNames.push(deletedBlog.coverImageFileName);
  }
  await deleteUnusedImages(fileNames, id);
}

// Editor ke liye upload hui image ka naam aur URL wapas deta hai
export function getUploadedContentImage(fileName: string | null): BlogImageResponse {
  if (!fileName) {
    throw new AppError("Choose an image to upload", 400);
  }
  return { fileName: fileName, url: BLOG_IMAGES_URL + fileName };
}
