// A FAQ as saved on the server: one question with its answer
export type Faq = {
  id: string
  question: string
  answer: string
}

// A FAQ ready to be sent to the server (also the values of the FAQ form)
export type NewFaq = {
  question: string
  answer: string
}
