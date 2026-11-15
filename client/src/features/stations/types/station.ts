// A train station the office has saved on the admin panel's "Stations" page,
// from GET /api/public/stations
export type PublicStation = {
  id: string
  name: string
  description: string
  address: string
  // e.g. ["/uploads/stations/1700000000-123.jpg"] (use getFileUrl). Can be empty.
  imageUrls: string[]
}
