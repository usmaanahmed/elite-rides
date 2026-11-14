// Event ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createEvent, deleteEvent, getAllEvents, updateEvent } from "./event.service.js";

// Multer ki save ki hui files ke sirf naam nikalta hai
function getUploadedFileNames(req: Request): string[] {
  const fileNames: string[] = [];
  if (Array.isArray(req.files)) {
    for (const file of req.files) {
      fileNames.push(file.filename);
    }
  }
  return fileNames;
}

// GET /api/events
export async function getEvents(req: Request, res: Response) {
  const events = await getAllEvents();
  res.json(events);
}

// POST /api/events (form data + images)
export async function addEvent(req: Request, res: Response) {
  const event = await createEvent(req.body, getUploadedFileNames(req));
  res.status(201).json(event);
}

// PUT /api/events/:id (form data, nayi images optional)
export async function editEvent(req: Request<{ id: string }>, res: Response) {
  const event = await updateEvent(req.params.id, req.body, getUploadedFileNames(req));
  res.json(event);
}

// DELETE /api/events/:id
export async function removeEvent(req: Request<{ id: string }>, res: Response) {
  await deleteEvent(req.params.id);
  res.json({ message: "Event deleted" });
}
