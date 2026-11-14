import { getFileUrl } from '../../../shared/api/apiUrl'
import type { Airport } from '../types/airport'

// The server sends each image as a short path ("/uploads/airports/photo.jpg").
// This turns every path into a full link the <img> tag can load.
export function withFullImageUrls(airport: Airport): Airport {
  const images = airport.images.map((image) => {
    return { fileName: image.fileName, url: getFileUrl(image.url) ?? '' }
  })
  return { ...airport, images: images }
}
