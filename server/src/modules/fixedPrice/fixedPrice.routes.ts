// Fixed price module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addFixedPrices,
  editFixedPrice,
  getFixedPrices,
  importFixedPricesHandler,
  removeAllFixedPrices,
  removeFixedPrice,
} from "./fixedPrice.controller.js";
import { createFixedPriceSchema, fixedPriceSchema, importFixedPricesSchema } from "./fixedPrice.validation.js";

const router = Router();

router.get("/", getFixedPrices);
router.post("/", validate(createFixedPriceSchema), addFixedPrices);

// Note: "/import" aur "/all" "/:id" se pehle hone chahiye
router.post("/import", validate(importFixedPricesSchema), importFixedPricesHandler);
router.delete("/all", removeAllFixedPrices);

router.put("/:id", validate(fixedPriceSchema), editFixedPrice);
router.delete("/:id", removeFixedPrice);

export default router;
