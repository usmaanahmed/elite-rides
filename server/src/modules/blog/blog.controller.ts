// Blog ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getUploadedContentImage,
  updateBlog,
} from "./blog.service.js";

// Multer ki save ki hui ek image ka naam (image na aayi ho to null)
function getUploadedFileName(req: Request): string | null {
  if (req.file) {
    return req.file.filename;
  }
  return null;
}

// GET /api/blogs
export async function getBlogs(req: Request, res: Response) {
  const blogs = await getAllBlogs();
  res.json(blogs);
}

// GET /api/blogs/:id
export async function getBlog(req: Request<{ id: string }>, res: Response) {
  const blog = await getBlogById(req.params.id);
  res.json(blog);
}

// POST /api/blogs (form data + cover image optional)
export async function addBlog(req: Request, res: Response) {
  const blog = await createBlog(req.body, getUploadedFileName(req));
  res.status(201).json(blog);
}

// PUT /api/blogs/:id (form data, nayi cover image optional)
export async function editBlog(req: Request<{ id: string }>, res: Response) {
  const blog = await updateBlog(req.params.id, req.body, getUploadedFileName(req));
  res.json(blog);
}

// DELETE /api/blogs/:id
export async function removeBlog(req: Request<{ id: string }>, res: Response) {
  await deleteBlog(req.params.id);
  res.json({ message: "Blog deleted" });
}

// POST /api/blogs/content-images (editor me lagane ke liye ek image)
export async function addContentImage(req: Request, res: Response) {
  const image = getUploadedContentImage(getUploadedFileName(req));
  res.status(201).json(image);
}
