// Airport ki business logic
import { isValidObjectId } from "mongoose";
import path from "path";
import { airportImagesFolder, MAX_AIRPORT_IMAGES } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFile } from "../../utils/deleteFile.js";
import {
  createAirport as saveAirport,
  deleteAirportById,
  findAirportById,
  findAllAirports,
  updateAirportById,
} from "./airport.repository.js";
import { AirportInput, AirportRecord, AirportResponse, AirportUpdateInput } from "./airport.types.js";

// Database wali airport ko frontend ke format me badalta hai
function toAirportResponse(airport: AirportRecord): AirportResponse {
  const images = airport.imageFileNames.map((fileName) => {
    return { fileName: fileName, url: "/uploads/airports/" + fileName };
  });

  return {
    id: airport._id.toString(),
    name: airport.name,
    description: airport.description,
    address: airport.address,
    images: images,
  };
}

// Disk se images delete karta hai (file names ki list do)
async function deleteImageFiles(fileNames: string[]): Promise<void> {
  for (const fileName of fileNames) {
    await deleteFile(path.join(airportImagesFolder, fileName));
  }
}

export async function getAllAirports(): Promise<AirportResponse[]> {
  const airports = await findAllAirports();
  return airports.map((airport) => toAirportResponse(airport as unknown as AirportRecord));
}

// Nayi airport banao. newImageFileNames wo images hain jo multer ne save kar di hain
export async function createAirport(input: AirportInput, newImageFileNames: string[]): Promise<AirportResponse> {
  try {
    const airport = await saveAirport({ ...input, imageFileNames: newImageFileNames });
    return toAirportResponse(airport.toObject() as unknown as AirportRecord);
  } catch (error) {
    // Airport save nahi hui to upload ho chuki images disk par bekaar na padi rahein
    await deleteImageFiles(newImageFileNames);
    throw error;
  }
}

// Airport edit karo: kuch purani images hatao, nayi jodo (total MAX_AIRPORT_IMAGES se zyada nahi)
export async function updateAirport(
  id: string,
  input: AirportUpdateInput,
  newImageFileNames: string[]
): Promise<AirportResponse> {
  if (!isValidObjectId(id)) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Airport not found", 404);
  }

  const existingAirport = await findAirportById(id);
  if (!existingAirport) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Airport not found", 404);
  }

  // Sirf wohi images hatao jo is airport ki apni hain
  const removedFileNames: string[] = [];
  const keptFileNames: string[] = [];
  for (const fileName of existingAirport.imageFileNames) {
    if (input.removedImages.includes(fileName)) {
      removedFileNames.push(fileName);
    } else {
      keptFileNames.push(fileName);
    }
  }

  const allFileNames = [...keptFileNames, ...newImageFileNames];
  if (allFileNames.length > MAX_AIRPORT_IMAGES) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("An airport can have up to " + MAX_AIRPORT_IMAGES + " images", 400);
  }

  const updatedAirport = await updateAirportById(id, {
    name: input.name,
    description: input.description,
    address: input.address,
    imageFileNames: allFileNames,
  });
  if (!updatedAirport) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Airport not found", 404);
  }

  await deleteImageFiles(removedFileNames);
  return toAirportResponse(updatedAirport as unknown as AirportRecord);
}

// Airport aur us ki saari images delete karo
export async function deleteAirport(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Airport not found", 404);
  }

  const deletedAirport = await deleteAirportById(id);
  if (!deletedAirport) {
    throw new AppError("Airport not found", 404);
  }

  await deleteImageFiles(deletedAirport.imageFileNames);
}
