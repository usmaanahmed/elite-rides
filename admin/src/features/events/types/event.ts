// One saved image of an event
export type EventImage = {
  // Name of the file on the server, used to tell the server which image to remove
  fileName: string
  // Full link the <img> tag can load
  url: string
}

// An event as saved on the server.
// Called "EventItem" (not "Event") because "Event" is already a built-in browser type.
export type EventItem = {
  id: string
  name: string
  description: string
  images: EventImage[]
}

// An event ready to be sent to the server
export type NewEvent = {
  name: string
  description: string
  // Images picked from the computer (new files only)
  newImages: File[]
  // File names of saved images to delete (only used when editing)
  removedImages: string[]
}

// The values exactly as they sit in the Event form
export type EventFormValues = {
  name: string
  description: string
  // Saved images that are kept (the admin can remove some of them)
  existingImages: EventImage[]
  // Newly picked images that are not uploaded yet
  newImages: File[]
}

// Which images the filter bar shows
export type EventImagesFilter = 'all' | 'with-images' | 'without-images'

// The values in the filter bar above the table
export type EventFilterValues = {
  name: string
  images: EventImagesFilter
}
