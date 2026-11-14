import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addEvent, deleteEvent, editEvent, getEvents } from '../api/eventsApi'
import type { NewEvent } from '../types/event'

// The name React Query uses to store the events in its cache
export const EVENTS_QUERY_KEY = ['events']

// Loads the events. Gives back the list plus loading / error info.
export function useEvents() {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: getEvents,
  })
}

// Saves a new event, then reloads the list so the table shows it
export function useAddEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY }),
  })
}

// Saves changes to an event, then reloads the list
export function useEditEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, event }: { eventId: string; event: NewEvent }) => editEvent(eventId, event),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY }),
  })
}

// Deletes an event, then reloads the list so the row disappears
export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY }),
  })
}
