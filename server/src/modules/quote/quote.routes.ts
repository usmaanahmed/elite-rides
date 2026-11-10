// Quote module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { getQuote } from "./quote.controller.js";
import { quoteSchema } from "./quote.validation.js";

const router = Router();

router.post("/", validate(quoteSchema), getQuote);

export default router;
