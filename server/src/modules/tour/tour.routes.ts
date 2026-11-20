// Tour module ke URLs
import { Router } from "express";
import { MAX_TOUR_IMAGES, uploadTourImages } from "../../middlewares/upload.js";
import { validate } from "../../middlewares/validate.js";
import { addTour, editTour, getTours, removeTour } from "./tour.controller.js";
import { createTourSchema, updateTourSchema } from "./tour.validation.js";

const router = Router();

// Form ki images "images" naam se aati hain (pehle upload, phir baqi fields ki validation)
const uploadImages = uploadTourImages.array("images", MAX_TOUR_IMAGES);

router.get("/", getTours);
router.post("/", uploadImages, validate(createTourSchema), addTour);
router.put("/:id", uploadImages, validate(updateTourSchema), editTour);
router.delete("/:id", removeTour);

export default router;
