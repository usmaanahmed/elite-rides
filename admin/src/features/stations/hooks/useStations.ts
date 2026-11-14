import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStation, deleteStation, editStation, getStations } from '../api/stationsApi'
import type { NewStation } from '../types/station'

// The name React Query uses to store the stations in its cache
export const STATIONS_QUERY_KEY = ['stations']

// Loads the stations. Gives back the list plus loading / error info.
export function useStations() {
  return useQuery({
    queryKey: STATIONS_QUERY_KEY,
    queryFn: getStations,
  })
}

// Saves a new station, then reloads the list so the table shows it
export function useAddStation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addStation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STATIONS_QUERY_KEY }),
  })
}

// Saves changes to a station, then reloads the list
export function useEditStation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ stationId, station }: { stationId: string; station: NewStation }) => editStation(stationId, station),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STATIONS_QUERY_KEY }),
  })
}

// Deletes a station, then reloads the list so the row disappears
export function useDeleteStation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STATIONS_QUERY_KEY }),
  })
}
