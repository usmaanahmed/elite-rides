// Station module ke URLs
import { Router } from "express";
import { MAX_STATION_IMAGES, uploadStationImages } from "../../middlewares/upload.js";
import { validate } from "../../middlewares/validate.js";
import { addStation, editStation, getStations, removeStation } from "./station.controller.js";
import { createStationSchema, updateStationSchema } from "./station.validation.js";

const router = Router();

// Form ki images "images" naam se aati hain (pehle upload, phir baqi fields ki validation)
const uploadImages = uploadStationImages.array("images", MAX_STATION_IMAGES);

router.get("/", getStations);
router.post("/", uploadImages, validate(createStationSchema), addStation);
router.put("/:id", uploadImages, validate(updateStationSchema), editStation);
router.delete("/:id", removeStation);

export default router;
