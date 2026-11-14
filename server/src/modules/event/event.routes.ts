// Event module ke URLs
import { Router } from "express";
import { MAX_EVENT_IMAGES, uploadEventImages } from "../../middlewares/upload.js";
import { validate } from "../../middlewares/validate.js";
import { addEvent, editEvent, getEvents, removeEvent } from "./event.controller.js";
import { createEventSchema, updateEventSchema } from "./event.validation.js";

const router = Router();

// Form ki images "images" naam se aati hain (pehle upload, phir baqi fields ki validation)
const uploadImages = uploadEventImages.array("images", MAX_EVENT_IMAGES);

router.get("/", getEvents);
router.post("/", uploadImages, validate(createEventSchema), addEvent);
router.put("/:id", uploadImages, validate(updateEventSchema), editEvent);
router.delete("/:id", removeEvent);

export default router;
