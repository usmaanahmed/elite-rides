// Tour ki business logic
import { isValidObjectId } from "mongoose";
import path from "path";
import { MAX_TOUR_IMAGES, tourImagesFolder } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { getAllVehicles } from "../vehicle/vehicle.service.js";
import {
  createTour as saveTour,
  deleteTourById,
  findAllTours,
  findTourById,
  updateTourById,
} from "./tour.repository.js";
import { TourInput, TourItineraryDay, TourRecord, TourResponse, TourUpdateInput } from "./tour.types.js";

// Database wala tour frontend ke format me badalta hai
function toTourResponse(tour: TourRecord): TourResponse {
  const images = tour.imageFileNames.map((fileName) => {
    return { fileName: fileName, url: "/uploads/tours/" + fileName };
  });

  return {
    id: tour._id.toString(),
    title: tour.title,
    description: tour.description,
    startDate: tour.startDate ?? "",
    endDate: tour.endDate ?? "",
    durationDays: tour.durationDays ?? 1,
    itinerary: toItineraryResponse(tour),
    prices: tour.prices.map((item) => ({ vehicleId: item.vehicleId, price: item.price })),
    images: images,
  };
}

// Itinerary ke din aur un ki jagahein (purane tours me itinerary nahi hoti, to khali list)
function toItineraryResponse(tour: TourRecord): TourItineraryDay[] {
  const days: TourItineraryDay[] = [];
  for (const day of tour.itinerary ?? []) {
    const places = day.places.map((place) => ({
      name: place.name,
      address: place.address ?? "",
      lat: place.lat ?? 0,
      lng: place.lng ?? 0,
      description: place.description,
    }));
    days.push({ title: day.title, places: places });
  }
  return days;
}

// Disk se images delete karta hai (file names ki list do)
async function deleteImageFiles(fileNames: string[]): Promise<void> {
  for (const fileName of fileNames) {
    await deleteFile(path.join(tourImagesFolder, fileName));
  }
}

// Har price ki vehicle mojood honi chahiye, aur ek vehicle ki price do baar nahi
async function checkPrices(input: TourInput): Promise<void> {
  const vehicles = await getAllVehicles();
  const usedVehicleIds: string[] = [];

  for (const item of input.prices) {
    const vehicleExists = vehicles.some((vehicle) => vehicle.id === item.vehicleId);
    if (!vehicleExists) {
      throw new AppError("prices: One of the vehicles no longer exists. Reload the page and try again.", 400);
    }
    if (usedVehicleIds.includes(item.vehicleId)) {
      throw new AppError("prices: A vehicle can only have one price", 400);
    }
    usedVehicleIds.push(item.vehicleId);
  }
}

export async function getAllTours(): Promise<TourResponse[]> {
  const tours = await findAllTours();
  return tours.map((tour) => toTourResponse(tour as unknown as TourRecord));
}

// Ek tour (na mile to 404)
export async function getTourById(id: string): Promise<TourResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Tour not found", 404);
  }
  const tour = await findTourById(id);
  if (!tour) {
    throw new AppError("Tour not found", 404);
  }
  return toTourResponse(tour as unknown as TourRecord);
}

// Naya tour banao. newImageFileNames wo images hain jo multer ne save kar di hain
export async function createTour(input: TourInput, newImageFileNames: string[]): Promise<TourResponse> {
  try {
    await checkPrices(input);
    const tour = await saveTour({ ...input, imageFileNames: newImageFileNames });
    return toTourResponse(tour.toObject() as unknown as TourRecord);
  } catch (error) {
    // Tour save nahi hua to upload ho chuki images disk par bekaar na padi rahein
    await deleteImageFiles(newImageFileNames);
    throw error;
  }
}

// Tour edit karo: kuch purani images hatao, nayi jodo (total MAX_TOUR_IMAGES se zyada nahi)
export async function updateTour(id: string, input: TourUpdateInput, newImageFileNames: string[]): Promise<TourResponse> {
  if (!isValidObjectId(id)) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Tour not found", 404);
  }

  const existingTour = await findTourById(id);
  if (!existingTour) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Tour not found", 404);
  }

  try {
    await checkPrices(input);
  } catch (error) {
    await deleteImageFiles(newImageFileNames);
    throw error;
  }

  // Sirf wohi images hatao jo is tour ki apni hain
  const removedFileNames: string[] = [];
  const keptFileNames: string[] = [];
  for (const fileName of existingTour.imageFileNames) {
    if (input.removedImages.includes(fileName)) {
      removedFileNames.push(fileName);
    } else {
      keptFileNames.push(fileName);
    }
  }

  const allFileNames = [...keptFileNames, ...newImageFileNames];
  if (allFileNames.length > MAX_TOUR_IMAGES) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("A tour can have up to " + MAX_TOUR_IMAGES + " images", 400);
  }

  const updatedTour = await updateTourById(id, {
    title: input.title,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    durationDays: input.durationDays,
    itinerary: input.itinerary,
    prices: input.prices,
    imageFileNames: allFileNames,
  });
  if (!updatedTour) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Tour not found", 404);
  }

  await deleteImageFiles(removedFileNames);
  return toTourResponse(updatedTour as unknown as TourRecord);
}

// Tour aur us ki saari images delete karo
export async function deleteTour(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Tour not found", 404);
  }

  const deletedTour = await deleteTourById(id);
  if (!deletedTour) {
    throw new AppError("Tour not found", 404);
  }

  await deleteImageFiles(deletedTour.imageFileNames);
}
