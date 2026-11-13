// Night surcharge module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addSurchargeNight,
  editSurchargeNight,
  getSurchargeNights,
  removeSurchargeNight,
} from "./surchargeNight.controller.js";
import { surchargeNightSchema } from "./surchargeNight.validation.js";

const router = Router();

router.get("/", getSurchargeNights);
router.post("/", validate(surchargeNightSchema), addSurchargeNight);
router.put("/:id", validate(surchargeNightSchema), editSurchargeNight);
router.delete("/:id", removeSurchargeNight);

export default router;
