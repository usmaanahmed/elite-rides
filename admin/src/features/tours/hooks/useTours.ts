import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addTour, deleteTour, editTour, getTours } from '../api/toursApi'
import type { NewTour } from '../types/tour'

// The name React Query uses to store the tours in its cache
export const TOURS_QUERY_KEY = ['tours']

// Loads the tours. Gives back the list plus loading / error info.
export function useTours() {
  return useQuery({
    queryKey: TOURS_QUERY_KEY,
    queryFn: getTours,
  })
}

// Saves a new tour, then reloads the list so the table shows it
export function useAddTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTour,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOURS_QUERY_KEY }),
  })
}

// Saves changes to a tour, then reloads the list
export function useEditTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tourId, tour }: { tourId: string; tour: NewTour }) => editTour(tourId, tour),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOURS_QUERY_KEY }),
  })
}

// Deletes a tour, then reloads the list so the row disappears
export function useDeleteTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTour,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOURS_QUERY_KEY }),
  })
}
