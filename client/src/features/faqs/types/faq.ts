// One question with its answer, from GET /api/public/faqs
// (the office manages these on the admin panel's "FAQs" page)
export type PublicFaq = {
  id: string
  question: string
  answer: string
}
