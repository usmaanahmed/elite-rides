// Night surcharge module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { readSurchargeNight, saveSurchargeNight } from "./surchargeNight.controller.js";
import { surchargeNightSchema } from "./surchargeNight.validation.js";

const router = Router();

router.get("/", readSurchargeNight);
router.put("/", validate(surchargeNightSchema), saveSurchargeNight);

export default router;
