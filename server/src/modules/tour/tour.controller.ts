// Tour ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createTour, deleteTour, getAllTours, updateTour } from "./tour.service.js";

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

// GET /api/tours
export async function getTours(req: Request, res: Response) {
  const tours = await getAllTours();
  res.json(tours);
}

// POST /api/tours (form data + images)
export async function addTour(req: Request, res: Response) {
  const tour = await createTour(req.body, getUploadedFileNames(req));
  res.status(201).json(tour);
}

// PUT /api/tours/:id (form data, nayi images optional)
export async function editTour(req: Request<{ id: string }>, res: Response) {
  const tour = await updateTour(req.params.id, req.body, getUploadedFileNames(req));
  res.json(tour);
}

// DELETE /api/tours/:id
export async function removeTour(req: Request<{ id: string }>, res: Response) {
  await deleteTour(req.params.id);
  res.json({ message: "Tour deleted" });
}
