import { getFileUrl } from '../../../shared/api/apiUrl'
import type { EventItem } from '../types/event'

// The server sends each image as a short path ("/uploads/events/photo.jpg").
// This turns every path into a full link the <img> tag can load.
export function withFullImageUrls(event: EventItem): EventItem {
  const images = event.images.map((image) => {
    return { fileName: image.fileName, url: getFileUrl(image.url) ?? '' }
  })
  return { ...event, images: images }
}
