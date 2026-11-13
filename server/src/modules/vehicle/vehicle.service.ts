// Vehicle ki business logic
import { isValidObjectId } from "mongoose";
import path from "path";
import { vehicleImagesFolder } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { hasActiveBookingsForVehicle } from "../booking/booking.lookup.service.js";
import {
  createVehicle as saveVehicle,
  deleteVehicleById,
  findAllVehicles,
  findVehicleById,
  findVehicleWithHighestDisplayOrder,
  findVehicleWithHighestTbmsId,
  updateCalculationFormats,
  updateVehicleById,
  updateVehicleRates as saveVehicleRates,
} from "./vehicle.repository.js";
import {
  CalculationFormatItem,
  RatesInput,
  VehicleInput,
  VehicleRecord,
  VehicleResponse,
  VehicleUpdateInput,
} from "./vehicle.types.js";

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
    displayOrder: vehicle.displayOrder,
    fixedPrice: vehicle.fixedPrice,
    hourlyRate: vehicle.hourlyRate,
    rateType: vehicle.rateType,
    mileageBands: vehicle.mileageBands,
    slabBands: vehicle.slabBands,
    calculationFormat: vehicle.calculationFormat ?? { type: "fixed", value: 0 },
  };
}

export async function getAllVehicles(): Promise<VehicleResponse[]> {
  const vehicles = await findAllVehicles();
  return vehicles.map(toVehicleResponse);
}

// Nayi vehicle banao. Is ko agla TBMS ID aur list ke aakhir wala display order khud milta hai
export async function createVehicle(input: VehicleInput, imageFileName: string): Promise<VehicleResponse> {
  const lastVehicle = await findVehicleWithHighestTbmsId();
  const nextTbmsId = lastVehicle ? lastVehicle.tbmsId + 1 : FIRST_TBMS_ID;

  const lastInOrder = await findVehicleWithHighestDisplayOrder();
  const nextDisplayOrder = lastInOrder ? lastInOrder.displayOrder + 1 : 1;

  const vehicle = await saveVehicle({
    ...input,
    tbmsId: nextTbmsId,
    displayOrder: nextDisplayOrder,
    imageFileName: imageFileName,
  });
  return toVehicleResponse(vehicle);
}

// Vehicle ki tafseelaat edit karo. Nayi image di ho to purani delete kar do
export async function updateVehicle(id: string, input: VehicleUpdateInput, newImageFileName?: string): Promise<VehicleResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Vehicle not found", 404);
  }

  const existingVehicle = await findVehicleById(id);
  if (!existingVehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  const updatedVehicle = await updateVehicleById(id, {
    ...input,
    ...(newImageFileName ? { imageFileName: newImageFileName } : {}),
  });
  if (!updatedVehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  if (newImageFileName) {
    await deleteFile(path.join(vehicleImagesFolder, existingVehicle.imageFileName));
  }

  return toVehicleResponse(updatedVehicle);
}

type Band = { fromMiles: number; toMiles: number };

// Bands ko fromMiles se sort karta hai
function sortBandsByFromMiles(bands: Band[]): Band[] {
  return [...bands].sort((a, b) => a.fromMiles - b.fromMiles);
}

// Mileage/slab bands check karta hai: pehla band 1 mile se shuru ho aur bands continuous hon (koi gap na ho)
function checkBandsAreContinuous(bands: Band[]) {
  if (bands.length === 0) {
    return;
  }

  const sortedBands = sortBandsByFromMiles(bands);

  if (sortedBands[0].fromMiles !== 1) {
    throw new AppError("The first band must start from 1 mile", 400);
  }

  for (let i = 0; i < sortedBands.length - 1; i++) {
    const currentBand = sortedBands[i];
    const nextBand = sortedBands[i + 1];

    if (currentBand.toMiles !== nextBand.fromMiles) {
      throw new AppError("Bands must be continuous, with no gaps between them", 400);
    }
  }
}

// "£ Rates" modal se rateType, fixed price, hourly rate aur bands ek saath save karo
export async function updateVehicleRates(id: string, input: RatesInput): Promise<VehicleResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Vehicle not found", 404);
  }

  if (input.rateType === "mileage") {
    checkBandsAreContinuous(input.mileageBands);
  } else {
    checkBandsAreContinuous(input.slabBands);
  }

  const updatedVehicle = await saveVehicleRates(id, input);
  if (!updatedVehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  return toVehicleResponse(updatedVehicle);
}

// "Add Calculation Format" modal: har vehicle ka premium ek saath save karo
export async function updateCalculationFormat(items: CalculationFormatItem[]): Promise<void> {
  for (const item of items) {
    if (!isValidObjectId(item.vehicleId)) {
      throw new AppError("Vehicle not found", 404);
    }
  }

  await updateCalculationFormats(items);
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

  // Active bookings wali vehicle delete nahi ho sakti
  if (await hasActiveBookingsForVehicle(id)) {
    throw new AppError("This vehicle has active bookings and cannot be deleted", 409);
  }

  await deleteVehicleById(id);
  await deleteFile(path.join(vehicleImagesFolder, vehicle.imageFileName));
}
