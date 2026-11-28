import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Faq, NewFaq } from '../types/faq'

// Loads all FAQs
export async function getFaqs(): Promise<Faq[]> {
  const response = await apiFetch('/faqs')
  return (await readJsonResponse(response)) as Faq[]
}

// Saves a new FAQ
export async function addFaq(faq: NewFaq): Promise<Faq> {
  const response = await apiFetch('/faqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faq),
  })
  return (await readJsonResponse(response)) as Faq
}

// Saves changes to an existing FAQ
export async function editFaq(faqId: string, faq: NewFaq): Promise<Faq> {
  const response = await apiFetch(`/faqs/${faqId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faq),
  })
  return (await readJsonResponse(response)) as Faq
}

// Deletes a FAQ
export async function deleteFaq(faqId: string): Promise<void> {
  const response = await apiFetch(`/faqs/${faqId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
