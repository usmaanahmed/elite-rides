// Vehicle module ke URLs
import { Router } from "express";
import { uploadVehicleImage } from "../../middlewares/upload.js";
import { validate } from "../../middlewares/validate.js";
import { addVehicle, getVehicles, removeVehicle } from "./vehicle.controller.js";
import { createVehicleSchema } from "./vehicle.validation.js";

const router = Router();

// GET /api/vehicles
router.get("/", getVehicles);

// POST /api/vehicles (pehle image upload, phir baqi fields ki validation)
router.post("/", uploadVehicleImage.single("image"), validate(createVehicleSchema), addVehicle);

// DELETE /api/vehicles/:id
router.delete("/:id", removeVehicle);

export default router;
