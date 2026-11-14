// Blog module ke URLs
import { Router } from "express";
import { uploadBlogImage } from "../../middlewares/upload.js";
import { validate } from "../../middlewares/validate.js";
import { addBlog, addContentImage, editBlog, getBlog, getBlogs, removeBlog } from "./blog.controller.js";
import { createBlogSchema, updateBlogSchema } from "./blog.validation.js";

const router = Router();

// Blog form ki cover image "coverImage" naam se aati hai (pehle upload, phir baqi fields ki validation)
const uploadCoverImage = uploadBlogImage.single("coverImage");

router.get("/", getBlogs);
router.get("/:id", getBlog);

// Editor me image lagane ke liye: image foran upload hoti hai aur us ka URL wapas aata hai
router.post("/content-images", uploadBlogImage.single("image"), addContentImage);

router.post("/", uploadCoverImage, validate(createBlogSchema), addBlog);
router.put("/:id", uploadCoverImage, validate(updateBlogSchema), editBlog);
router.delete("/:id", removeBlog);

export default router;
