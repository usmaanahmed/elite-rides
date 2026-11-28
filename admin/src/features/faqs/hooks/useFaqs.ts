import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addFaq, deleteFaq, editFaq, getFaqs } from '../api/faqsApi'
import type { NewFaq } from '../types/faq'

// The name React Query uses to store the FAQs in its cache
export const FAQS_QUERY_KEY = ['faqs']

// Loads the FAQs. Gives back the list plus loading / error info.
export function useFaqs() {
  return useQuery({
    queryKey: FAQS_QUERY_KEY,
    queryFn: getFaqs,
  })
}

// Saves a new FAQ, then reloads the list so the table shows it
export function useAddFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFaq,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY }),
  })
}

// Saves changes to a FAQ, then reloads the list
export function useEditFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ faqId, faq }: { faqId: string; faq: NewFaq }) => editFaq(faqId, faq),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY }),
  })
}

// Deletes a FAQ, then reloads the list so the row disappears
export function useDeleteFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY }),
  })
}
