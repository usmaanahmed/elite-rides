// FAQ module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { addFaq, editFaq, getFaqs, removeFaq } from "./faq.controller.js";
import { faqSchema } from "./faq.validation.js";

const router = Router();

router.get("/", getFaqs);
router.post("/", validate(faqSchema), addFaq);
router.put("/:id", validate(faqSchema), editFaq);
router.delete("/:id", removeFaq);

export default router;
