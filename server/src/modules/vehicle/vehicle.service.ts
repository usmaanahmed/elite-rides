// Vehicle ki business logic
import { isValidObjectId } from "mongoose";
import path from "path";
import { vehicleImagesFolder } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFile } from "../../utils/deleteFile.js";
import {
  createVehicle as saveVehicle,
  deleteVehicleById,
  findAllVehicles,
  findVehicleById,
  findVehicleWithHighestTbmsId,
} from "./vehicle.repository.js";
import { VehicleInput, VehicleRecord, VehicleResponse } from "./vehicle.types.js";

const FIRST_TBMS_ID = 1001;

// Database wali vehicle ko frontend ke format me badalta hai
function toVehicleResponse(vehicle: VehicleRecord): VehicleResponse {
  return {
    id: vehicle._id.toString(),
    tbmsId: String(vehicle.tbmsId),
    name: vehicle.name,
    description: vehicle.description,
    passengerCapacity: vehicle.passengerCapacity,
    luggageCapacity: vehicle.luggageCapacity,
    handLuggageCapacity: vehicle.handLuggageCapacity,
    discountRate: vehicle.discountRate,
    returnDiscountRate: vehicle.returnDiscountRate,
    imageUrl: "/uploads/vehicles/" + vehicle.imageFileName,
  };
}

export async function getAllVehicles(): Promise<VehicleResponse[]> {
  const vehicles = await findAllVehicles();
  return vehicles.map(toVehicleResponse);
}

// Nayi vehicle banao. Is ko agla TBMS ID khud milta hai
export async function createVehicle(input: VehicleInput, imageFileName: string): Promise<VehicleResponse> {
  const lastVehicle = await findVehicleWithHighestTbmsId();
  const nextTbmsId = lastVehicle ? lastVehicle.tbmsId + 1 : FIRST_TBMS_ID;

  const vehicle = await saveVehicle({ ...input, tbmsId: nextTbmsId, imageFileName: imageFileName });
  return toVehicleResponse(vehicle);
}

// Vehicle aur us ki image dono delete karo
export async function deleteVehicle(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Vehicle not found", 404);
  }

  const vehicle = await findVehicleById(id);
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  await deleteVehicleById(id);
  await deleteFile(path.join(vehicleImagesFolder, vehicle.imageFileName));
}
