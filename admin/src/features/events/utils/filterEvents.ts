import type { EventItem, EventFilterValues } from '../types/event'

// Keeps only the events that match the filter bar (name and images)
export function filterEvents(events: EventItem[], filters: EventFilterValues): EventItem[] {
  const nameText = filters.name.trim().toLowerCase()
  const matches: EventItem[] = []

  for (const event of events) {
    if (nameText !== '' && !event.name.toLowerCase().includes(nameText)) {
      continue
    }
    if (filters.images === 'with-images' && event.images.length === 0) {
      continue
    }
    if (filters.images === 'without-images' && event.images.length > 0) {
      continue
    }
    matches.push(event)
  }
  return matches
}
