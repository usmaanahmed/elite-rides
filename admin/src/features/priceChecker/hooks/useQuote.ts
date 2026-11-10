import { useMutation } from '@tanstack/react-query'
import { getQuote } from '../api/quotesApi'

// Gets a quote. It is a mutation (not a query) because it runs only when the user presses the button.
export function useQuote() {
  return useMutation({
    mutationFn: getQuote,
  })
}
