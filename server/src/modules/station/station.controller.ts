// Station ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createStation, deleteStation, getAllStations, updateStation } from "./station.service.js";

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

// GET /api/stations
export async function getStations(req: Request, res: Response) {
  const stations = await getAllStations();
  res.json(stations);
}

// POST /api/stations (form data + images)
export async function addStation(req: Request, res: Response) {
  const station = await createStation(req.body, getUploadedFileNames(req));
  res.status(201).json(station);
}

// PUT /api/stations/:id (form data, nayi images optional)
export async function editStation(req: Request<{ id: string }>, res: Response) {
  const station = await updateStation(req.params.id, req.body, getUploadedFileNames(req));
  res.json(station);
}

// DELETE /api/stations/:id
export async function removeStation(req: Request<{ id: string }>, res: Response) {
  await deleteStation(req.params.id);
  res.json({ message: "Station deleted" });
}
