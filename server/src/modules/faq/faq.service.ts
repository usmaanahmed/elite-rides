// FAQ ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { createFaq as saveFaq, deleteFaqById, findAllFaqs, updateFaqById } from "./faq.repository.js";
import { FaqInput, FaqRecord, FaqResponse } from "./faq.types.js";

// Database wali FAQ ko frontend ke format me badalta hai
function toFaqResponse(faq: FaqRecord): FaqResponse {
  return {
    id: faq._id.toString(),
    question: faq.question,
    answer: faq.answer,
  };
}

export async function getAllFaqs(): Promise<FaqResponse[]> {
  const faqs = await findAllFaqs();
  return faqs.map((faq) => toFaqResponse(faq as unknown as FaqRecord));
}

export async function createFaq(input: FaqInput): Promise<FaqResponse> {
  const faq = await saveFaq(input);
  return toFaqResponse(faq.toObject() as unknown as FaqRecord);
}

export async function updateFaq(id: string, input: FaqInput): Promise<FaqResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("FAQ not found", 404);
  }

  const updatedFaq = await updateFaqById(id, input);
  if (!updatedFaq) {
    throw new AppError("FAQ not found", 404);
  }
  return toFaqResponse(updatedFaq as unknown as FaqRecord);
}

export async function deleteFaq(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("FAQ not found", 404);
  }

  const deletedFaq = await deleteFaqById(id);
  if (!deletedFaq) {
    throw new AppError("FAQ not found", 404);
  }
}
