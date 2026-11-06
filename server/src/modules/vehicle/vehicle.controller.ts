// Vehicle ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { createVehicle, deleteVehicle, getAllVehicles } from "./vehicle.service.js";

// GET /api/vehicles
export async function getVehicles(req: Request, res: Response) {
  const vehicles = await getAllVehicles();
  res.json(vehicles);
}

// POST /api/vehicles (form data + image)
export async function addVehicle(req: Request, res: Response) {
  if (!req.file) {
    throw new AppError("image: Choose a photo of the car", 400);
  }

  const vehicle = await createVehicle(req.body, req.file.filename);
  res.status(201).json(vehicle);
}

// DELETE /api/vehicles/:id
export async function removeVehicle(req: Request<{ id: string }>, res: Response) {
  await deleteVehicle(req.params.id);
  res.json({ message: "Vehicle deleted" });
}
