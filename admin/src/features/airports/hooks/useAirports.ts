import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addAirport, deleteAirport, editAirport, getAirports } from '../api/airportsApi'
import type { NewAirport } from '../types/airport'

// The name React Query uses to store the airports in its cache
export const AIRPORTS_QUERY_KEY = ['airports']

// Loads the airports. Gives back the list plus loading / error info.
export function useAirports() {
  return useQuery({
    queryKey: AIRPORTS_QUERY_KEY,
    queryFn: getAirports,
  })
}

// Saves a new airport, then reloads the list so the table shows it
export function useAddAirport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addAirport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AIRPORTS_QUERY_KEY }),
  })
}

// Saves changes to an airport, then reloads the list
export function useEditAirport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ airportId, airport }: { airportId: string; airport: NewAirport }) => editAirport(airportId, airport),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AIRPORTS_QUERY_KEY }),
  })
}

// Deletes an airport, then reloads the list so the row disappears
export function useDeleteAirport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAirport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AIRPORTS_QUERY_KEY }),
  })
}
