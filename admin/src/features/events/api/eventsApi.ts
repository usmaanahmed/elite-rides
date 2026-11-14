import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { EventItem, NewEvent } from '../types/event'
import { withFullImageUrls } from '../utils/withFullImageUrls'

// Images mean the data has to be sent as FormData instead of JSON
function buildFormData(event: NewEvent): FormData {
  const formData = new FormData()
  formData.append('name', event.name)
  formData.append('description', event.description)

  for (const file of event.newImages) {
    formData.append('images', file)
  }
  // The "[]" tells the server this field is a list, even when it holds only one name
  for (const fileName of event.removedImages) {
    formData.append('removedImages[]', fileName)
  }
  return formData
}

// Loads all events
export async function getEvents(): Promise<EventItem[]> {
  const response = await apiFetch('/events')
  const events = (await readJsonResponse(response)) as EventItem[]
  return events.map(withFullImageUrls)
}

// Saves a new event
export async function addEvent(event: NewEvent): Promise<EventItem> {
  const response = await apiFetch('/events', { method: 'POST', body: buildFormData(event) })
  const savedEvent = (await readJsonResponse(response)) as EventItem
  return withFullImageUrls(savedEvent)
}

// Saves changes to an existing event
export async function editEvent(eventId: string, event: NewEvent): Promise<EventItem> {
  const response = await apiFetch(`/events/${eventId}`, { method: 'PUT', body: buildFormData(event) })
  const savedEvent = (await readJsonResponse(response)) as EventItem
  return withFullImageUrls(savedEvent)
}

// Deletes an event (and its images)
export async function deleteEvent(eventId: string): Promise<void> {
  const response = await apiFetch(`/events/${eventId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
