// Event ki business logic
import { isValidObjectId } from "mongoose";
import path from "path";
import { eventImagesFolder, MAX_EVENT_IMAGES } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFile } from "../../utils/deleteFile.js";
import {
  createEvent as saveEvent,
  deleteEventById,
  findEventById,
  findAllEvents,
  updateEventById,
} from "./event.repository.js";
import { EventInput, EventRecord, EventResponse, EventUpdateInput } from "./event.types.js";

// Database wala event frontend ke format me badalta hai
function toEventResponse(event: EventRecord): EventResponse {
  const images = event.imageFileNames.map((fileName) => {
    return { fileName: fileName, url: "/uploads/events/" + fileName };
  });

  return {
    id: event._id.toString(),
    name: event.name,
    description: event.description,
    images: images,
  };
}

// Disk se images delete karta hai (file names ki list do)
async function deleteImageFiles(fileNames: string[]): Promise<void> {
  for (const fileName of fileNames) {
    await deleteFile(path.join(eventImagesFolder, fileName));
  }
}

export async function getAllEvents(): Promise<EventResponse[]> {
  const events = await findAllEvents();
  return events.map((event) => toEventResponse(event as unknown as EventRecord));
}

// Naya event banao. newImageFileNames wo images hain jo multer ne save kar di hain
export async function createEvent(input: EventInput, newImageFileNames: string[]): Promise<EventResponse> {
  try {
    const event = await saveEvent({ ...input, imageFileNames: newImageFileNames });
    return toEventResponse(event.toObject() as unknown as EventRecord);
  } catch (error) {
    // Event save nahi hua to upload ho chuki images disk par bekaar na padi rahein
    await deleteImageFiles(newImageFileNames);
    throw error;
  }
}

// Event edit karo: kuch purani images hatao, nayi jodo (total MAX_EVENT_IMAGES se zyada nahi)
export async function updateEvent(
  id: string,
  input: EventUpdateInput,
  newImageFileNames: string[]
): Promise<EventResponse> {
  if (!isValidObjectId(id)) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Event not found", 404);
  }

  const existingEvent = await findEventById(id);
  if (!existingEvent) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Event not found", 404);
  }

  // Sirf wohi images hatao jo is event ki apni hain
  const removedFileNames: string[] = [];
  const keptFileNames: string[] = [];
  for (const fileName of existingEvent.imageFileNames) {
    if (input.removedImages.includes(fileName)) {
      removedFileNames.push(fileName);
    } else {
      keptFileNames.push(fileName);
    }
  }

  const allFileNames = [...keptFileNames, ...newImageFileNames];
  if (allFileNames.length > MAX_EVENT_IMAGES) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("An event can have up to " + MAX_EVENT_IMAGES + " images", 400);
  }

  const updatedEvent = await updateEventById(id, {
    name: input.name,
    description: input.description,
    imageFileNames: allFileNames,
  });
  if (!updatedEvent) {
    await deleteImageFiles(newImageFileNames);
    throw new AppError("Event not found", 404);
  }

  await deleteImageFiles(removedFileNames);
  return toEventResponse(updatedEvent as unknown as EventRecord);
}

// Event aur us ki saari images delete karo
export async function deleteEvent(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Event not found", 404);
  }

  const deletedEvent = await deleteEventById(id);
  if (!deletedEvent) {
    throw new AppError("Event not found", 404);
  }

  await deleteImageFiles(deletedEvent.imageFileNames);
}
