import { useQuery } from '@tanstack/react-query'
import { getPublicFaqs } from '../api/faqsApi'

// FAQs change rarely, so React Query keeps them for 5 minutes before asking again
const FIVE_MINUTES = 5 * 60 * 1000

// The questions and answers shown in the "FAQ" section of the home page
export function usePublicFaqs() {
  return useQuery({
    queryKey: ['public-faqs'],
    queryFn: getPublicFaqs,
    staleTime: FIVE_MINUTES,
  })
}
