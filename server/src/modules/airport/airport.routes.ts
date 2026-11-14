// Airport module ke URLs
import { Router } from "express";
import { MAX_AIRPORT_IMAGES, uploadAirportImages } from "../../middlewares/upload.js";
import { validate } from "../../middlewares/validate.js";
import { addAirport, editAirport, getAirports, removeAirport } from "./airport.controller.js";
import { createAirportSchema, updateAirportSchema } from "./airport.validation.js";

const router = Router();

// Form ki images "images" naam se aati hain (pehle upload, phir baqi fields ki validation)
const uploadImages = uploadAirportImages.array("images", MAX_AIRPORT_IMAGES);

router.get("/", getAirports);
router.post("/", uploadImages, validate(createAirportSchema), addAirport);
router.put("/:id", uploadImages, validate(updateAirportSchema), editAirport);
router.delete("/:id", removeAirport);

export default router;
