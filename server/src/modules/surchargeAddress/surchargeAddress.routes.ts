// Surcharge address module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addSurchargeAddress,
  editSurchargeAddress,
  getSurchargeAddresses,
  removeSurchargeAddress,
} from "./surchargeAddress.controller.js";
import { surchargeAddressSchema } from "./surchargeAddress.validation.js";

const router = Router();

router.get("/", getSurchargeAddresses);
router.post("/", validate(surchargeAddressSchema), addSurchargeAddress);
router.put("/:id", validate(surchargeAddressSchema), editSurchargeAddress);
router.delete("/:id", removeSurchargeAddress);

export default router;
