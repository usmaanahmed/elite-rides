// Vehicle module ke URLs
import { Router } from "express";
import { uploadVehicleImage } from "../../middlewares/upload.js";
import { validate } from "../../middlewares/validate.js";
import {
  addVehicle,
  editCalculationFormat,
  editVehicle,
  editVehicleRates,
  getVehicles,
  removeVehicle,
} from "./vehicle.controller.js";
import { createVehicleSchema, updateCalculationFormatSchema, updateRatesSchema, updateVehicleSchema } from "./vehicle.validation.js";

const router = Router();

// GET /api/vehicles
router.get("/", getVehicles);

// POST /api/vehicles (pehle image upload, phir baqi fields ki validation)
router.post("/", uploadVehicleImage.single("image"), validate(createVehicleSchema), addVehicle);

// PUT /api/vehicles/calculation-format (saari vehicles ka premium ek saath)
// Note: yeh route "/:id" se pehle hona chahiye, warna Express "calculation-format" ko id samjh legi
router.put("/calculation-format", validate(updateCalculationFormatSchema), editCalculationFormat);

// PUT /api/vehicles/:id/rates (mileage/slab bands + fixed price + hourly rate)
router.put("/:id/rates", validate(updateRatesSchema), editVehicleRates);

// PUT /api/vehicles/:id (form data, nayi image optional)
router.put("/:id", uploadVehicleImage.single("image"), validate(updateVehicleSchema), editVehicle);

// DELETE /api/vehicles/:id
router.delete("/:id", removeVehicle);

export default router;
