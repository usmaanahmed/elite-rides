// Surcharge on date module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addSurchargeDate,
  editSurchargeDate,
  getSurchargeDates,
  removeSurchargeDate,
} from "./surchargeDate.controller.js";
import { surchargeDateSchema } from "./surchargeDate.validation.js";

const router = Router();

router.get("/", getSurchargeDates);
router.post("/", validate(surchargeDateSchema), addSurchargeDate);
router.put("/:id", validate(surchargeDateSchema), editSurchargeDate);
router.delete("/:id", removeSurchargeDate);

export default router;
