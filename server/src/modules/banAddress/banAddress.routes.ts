// Ban address module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { addBanAddress, getBanAddresses, removeBanAddress } from "./banAddress.controller.js";
import { banAddressSchema } from "./banAddress.validation.js";

const router = Router();

router.get("/", getBanAddresses);
router.post("/", validate(banAddressSchema), addBanAddress);
router.delete("/:id", removeBanAddress);

export default router;
