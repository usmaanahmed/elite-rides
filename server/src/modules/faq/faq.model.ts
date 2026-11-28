// FAQ ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Faq = model("Faq", faqSchema);
