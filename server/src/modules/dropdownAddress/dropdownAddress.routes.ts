// Drop down address module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addDropdownAddress,
  editDropdownAddress,
  getDropdownAddresses,
  importAddresses,
  removeDropdownAddress,
} from "./dropdownAddress.controller.js";
import { dropdownAddressSchema, importDropdownAddressesSchema } from "./dropdownAddress.validation.js";

const router = Router();

router.get("/", getDropdownAddresses);
router.post("/", validate(dropdownAddressSchema), addDropdownAddress);

// Note: "/import" "/:id" se pehle hona chahiye
router.post("/import", validate(importDropdownAddressesSchema), importAddresses);

router.put("/:id", validate(dropdownAddressSchema), editDropdownAddress);
router.delete("/:id", removeDropdownAddress);

export default router;
