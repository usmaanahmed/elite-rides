// Airport ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createAirport, deleteAirport, getAllAirports, updateAirport } from "./airport.service.js";

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

// GET /api/airports
export async function getAirports(req: Request, res: Response) {
  const airports = await getAllAirports();
  res.json(airports);
}

// POST /api/airports (form data + images)
export async function addAirport(req: Request, res: Response) {
  const airport = await createAirport(req.body, getUploadedFileNames(req));
  res.status(201).json(airport);
}

// PUT /api/airports/:id (form data, nayi images optional)
export async function editAirport(req: Request<{ id: string }>, res: Response) {
  const airport = await updateAirport(req.params.id, req.body, getUploadedFileNames(req));
  res.json(airport);
}

// DELETE /api/airports/:id
export async function removeAirport(req: Request<{ id: string }>, res: Response) {
  await deleteAirport(req.params.id);
  res.json({ message: "Airport deleted" });
}
