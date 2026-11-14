import { getFileUrl } from '../../../shared/api/apiUrl'
import type { Station } from '../types/station'

// The server sends each image as a short path ("/uploads/stations/photo.jpg").
// This turns every path into a full link the <img> tag can load.
export function withFullImageUrls(station: Station): Station {
  const images = station.images.map((image) => {
    return { fileName: image.fileName, url: getFileUrl(image.url) ?? '' }
  })
  return { ...station, images: images }
}
