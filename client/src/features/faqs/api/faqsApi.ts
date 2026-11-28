import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { PublicFaq } from '../types/faq'

// Loads the questions and answers for the home page FAQ section
export async function getPublicFaqs(): Promise<PublicFaq[]> {
  const response = await fetch(`${API_URL}/public/faqs`)
  return (await readJsonResponse(response)) as PublicFaq[]
}
