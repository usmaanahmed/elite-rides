// Congestion address module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addCongestionAddress,
  editCongestionAddress,
  getCongestionAddresses,
  removeCongestionAddress,
} from "./congestionAddress.controller.js";
import { congestionAddressSchema } from "./congestionAddress.validation.js";

const router = Router();

router.get("/", getCongestionAddresses);
router.post("/", validate(congestionAddressSchema), addCongestionAddress);
router.put("/:id", validate(congestionAddressSchema), editCongestionAddress);
router.delete("/:id", removeCongestionAddress);

export default router;
