// Vehicle ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  updateCalculationFormat,
  updateVehicle,
  updateVehicleRates,
} from "./vehicle.service.js";

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

// PUT /api/vehicles/:id (form data, nayi image optional)
export async function editVehicle(req: Request<{ id: string }>, res: Response) {
  const vehicle = await updateVehicle(req.params.id, req.body, req.file?.filename);
  res.json(vehicle);
}

// PUT /api/vehicles/:id/rates
export async function editVehicleRates(req: Request<{ id: string }>, res: Response) {
  const vehicle = await updateVehicleRates(req.params.id, req.body);
  res.json(vehicle);
}

// PUT /api/vehicles/calculation-format
export async function editCalculationFormat(req: Request, res: Response) {
  await updateCalculationFormat(req.body.items);
  res.json({ message: "Calculation format saved" });
}

// DELETE /api/vehicles/:id
export async function removeVehicle(req: Request<{ id: string }>, res: Response) {
  await deleteVehicle(req.params.id);
  res.json({ message: "Vehicle deleted" });
}
