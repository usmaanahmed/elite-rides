import { getFileUrl } from '../../../shared/api/apiUrl'
import type { TourItem } from '../types/tour'

// The server sends each image as a short path ("/uploads/tours/photo.jpg").
// This turns every path into a full link the <img> tag can load.
// It also fills in the newer fields (dates, duration, itinerary) that older tours
// (or an older server) may not send, so the edit form never gets "undefined".
export function withFullImageUrls(tour: TourItem): TourItem {
  const images = tour.images.map((image) => {
    return { fileName: image.fileName, url: getFileUrl(image.url) ?? '' }
  })

  const itinerary = tour.itinerary ?? []
  const startDate = tour.startDate ?? ''
  const endDate = tour.endDate ?? ''
  const durationDays = tour.durationDays ?? 1

  return { ...tour, images: images, itinerary: itinerary, startDate: startDate, endDate: endDate, durationDays: durationDays }
}
