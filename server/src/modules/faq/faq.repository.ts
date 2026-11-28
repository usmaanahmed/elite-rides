// FAQ ke database queries (sirf queries, koi business logic nahi)
import { Faq } from "./faq.model.js";
import { FaqInput } from "./faq.types.js";

// Purani FAQ upar, nayi neeche (jis tarah add ki gayi)
export function findAllFaqs() {
  return Faq.find().sort({ createdAt: 1 }).lean();
}

export function createFaq(data: FaqInput) {
  return Faq.create(data);
}

export function updateFaqById(id: string, data: FaqInput) {
  return Faq.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteFaqById(id: string) {
  return Faq.findByIdAndDelete(id).lean();
}
