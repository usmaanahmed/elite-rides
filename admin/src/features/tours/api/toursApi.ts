import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { NewTour, TourItem } from '../types/tour'
import { withFullImageUrls } from '../utils/withFullImageUrls'

// Images mean the data has to be sent as FormData instead of JSON
function buildFormData(tour: NewTour): FormData {
  const formData = new FormData()
  formData.append('title', tour.title)
  formData.append('description', tour.description)
  // The prices go as one piece of JSON text, the server reads it back into a list
  formData.append('prices', JSON.stringify(tour.prices))

  for (const file of tour.newImages) {
    formData.append('images', file)
  }
  // The "[]" tells the server this field is a list, even when it holds only one name
  for (const fileName of tour.removedImages) {
    formData.append('removedImages[]', fileName)
  }
  return formData
}

// Loads all tours
export async function getTours(): Promise<TourItem[]> {
  const response = await apiFetch('/tours')
  const tours = (await readJsonResponse(response)) as TourItem[]
  return tours.map(withFullImageUrls)
}

// Saves a new tour
export async function addTour(tour: NewTour): Promise<TourItem> {
  const response = await apiFetch('/tours', { method: 'POST', body: buildFormData(tour) })
  const savedTour = (await readJsonResponse(response)) as TourItem
  return withFullImageUrls(savedTour)
}

// Saves changes to an existing tour
export async function editTour(tourId: string, tour: NewTour): Promise<TourItem> {
  const response = await apiFetch(`/tours/${tourId}`, { method: 'PUT', body: buildFormData(tour) })
  const savedTour = (await readJsonResponse(response)) as TourItem
  return withFullImageUrls(savedTour)
}

// Deletes a tour (and its images)
export async function deleteTour(tourId: string): Promise<void> {
  const response = await apiFetch(`/tours/${tourId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
