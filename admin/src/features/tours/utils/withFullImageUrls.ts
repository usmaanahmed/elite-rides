import { getFileUrl } from '../../../shared/api/apiUrl'
import type { TourItem } from '../types/tour'

// The server sends each image as a short path ("/uploads/tours/photo.jpg").
// This turns every path into a full link the <img> tag can load.
export function withFullImageUrls(tour: TourItem): TourItem {
  const images = tour.images.map((image) => {
    return { fileName: image.fileName, url: getFileUrl(image.url) ?? '' }
  })
  return { ...tour, images: images }
}
