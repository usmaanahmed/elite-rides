// Settings module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { readSettings, saveAllSettings } from "./setting.controller.js";
import { settingsSchema } from "./setting.validation.js";

const router = Router();

router.get("/", readSettings);
router.put("/", validate(settingsSchema), saveAllSettings);

export default router;
