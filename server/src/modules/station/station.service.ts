// Station ki business logic
import { isValidObjectId } from "mongoose";
import path from "path";
import { stationImagesFolder, MAX_STATION_IMAGES } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFile } from "../../utils/deleteFile.js";
import {
  createStation as saveStation,
  deleteStationById,
  findStationById,
  findAllStations,
  updateStationById,
} from "./station.repository.js";
import { StationInput, StationRecord, StationResponse, StationUpdateInput } from "./station.types.js";

// Database wali station ko frontend ke format me badalta hai
function toStationResponse(station: StationRecord): StationResponse {
  const images = station.imageFileNames.map((fileName) => {
    return { fileName: fileName, url: "/uploads/stations/" + fileName };
  });

  return {
    id: station._id.toString(),
    name: station.name,
    description: station.description,
    address: station.address,
    images: images,
  };
}

// Disk se images delete karta hai (file names ki list do)
async function deleteImageFiles(fileNames: string[]): Promise<void> {
  for (const fileName of fileNames) {
    await deleteFile(path.join(stationImagesFolder, fileName));
  }
}

export async function getAllStations(): Promise<StationResponse[]> {
  const stations = await findAllStations();
  return stations.map((station) => toStationResponse(station as unknown as StationRecord));
}

// Nayi station banao. newImageFileNames wo images hain jo multer ne save kar di hain
export async function createStation(input: StationInput, newImageFileNames: string[]): Promise<StationResponse> {
  try {
    const station = await saveStation({ ...input, imageFileNames: newImageFileNames });
    return toStationResponse(station.toObject() as unknown as StationRecord);
  } catch (error) {
    // Station save nahi hui to upload ho chuki images disk par bekaar na padi rahein
    await deleteImageFiles(newImageFileNames);
    throw error;
  }
}

// Station edit karo: kuch purani images hatao, nayi jodo (total MAX_STATION_IMAGES se zyada nahi)
export async function updateStation(
  id: string,
  input: StationUpdateInput,
  newImageFileNames: string[]
): Promise<StationResponse> {
  if (!isValidObjectId(id)) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Station not found", 404);
  }

  const existingStation = await findStationById(id);
  if (!existingStation) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Station not found", 404);
  }

  // Sirf wohi images hatao jo is station ki apni hain
  const removedFileNames: string[] = [];
  const keptFileNames: string[] = [];
  for (const fileName of existingStation.imageFileNames) {
    if (input.removedImages.includes(fileName)) {
      removedFileNames.push(fileName);
    } else {
      keptFileNames.push(fileName);
    }
  }

  const allFileNames = [...keptFileNames, ...newImageFileNames];
  if (allFileNames.length > MAX_STATION_IMAGES) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("A station can have up to " + MAX_STATION_IMAGES + " images", 400);
  }

  const updatedStation = await updateStationById(id, {
    name: input.name,
    description: input.description,
    address: input.address,
    imageFileNames: allFileNames,
  });
  if (!updatedStation) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Station not found", 404);
  }

  await deleteImageFiles(removedFileNames);
  return toStationResponse(updatedStation as unknown as StationRecord);
}

// Station aur us ki saari images delete karo
export async function deleteStation(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Station not found", 404);
  }

  const deletedStation = await deleteStationById(id);
  if (!deletedStation) {
    throw new AppError("Station not found", 404);
  }

  await deleteImageFiles(deletedStation.imageFileNames);
}
