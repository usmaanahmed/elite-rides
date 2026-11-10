import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Quote, QuoteRequest } from '../types/quote'

// Asks the server for the price of a journey for every vehicle
export async function getQuote(request: QuoteRequest): Promise<Quote> {
  const response = await apiFetch('/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return (await readJsonResponse(response)) as Quote
}
