// Multer ki setting: car, airport, station aur blog images ko disk par save karta hai
import fs from "fs";
import multer from "multer";
import path from "path";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const MAX_IMAGE_SIZE_MB = 2;
// Ek airport ki zyada se zyada itni images
export const MAX_AIRPORT_IMAGES = 5;
// Ek station ki zyada se zyada itni images
export const MAX_STATION_IMAGES = 5;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

// Vehicle images is folder me jaengi: uploads/vehicles
export const vehicleImagesFolder = path.join(env.uploadsFolder, "vehicles");
fs.mkdirSync(vehicleImagesFolder, { recursive: true });

// Airport images is folder me jaengi: uploads/airports
export const airportImagesFolder = path.join(env.uploadsFolder, "airports");
fs.mkdirSync(airportImagesFolder, { recursive: true });

// Station images is folder me jaengi: uploads/stations
export const stationImagesFolder = path.join(env.uploadsFolder, "stations");
fs.mkdirSync(stationImagesFolder, { recursive: true });

// Blog ki cover image aur blog ke andar lagi images is folder me jaengi: uploads/blogs
export const blogImagesFolder = path.join(env.uploadsFolder, "blogs");
fs.mkdirSync(blogImagesFolder, { recursive: true });

// Blog ka content (HTML) text field me aata hai, is liye us ki size limit thodi barhai hai
const MAX_BLOG_TEXT_FIELD_MB = 2;

// Ek folder ke liye storage banata hai (file ko us folder me unique naam se save karta hai)
function createStorage(folder: string) {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, folder);
    },
    // Unique naam banao taake do files ka naam kabhi same na ho
    filename: (req, file, callback) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1000000);
      callback(null, uniqueName + path.extname(file.originalname).toLowerCase());
    },
  });
}

// Sirf JPG, PNG aur WEBP images allow hain
function checkImageType(req: unknown, file: Express.Multer.File, callback: multer.FileFilterCallback) {
  if (allowedImageTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new AppError("Use a JPG, PNG or WEBP image", 400));
  }
}

export const uploadVehicleImage = multer({
  storage: createStorage(vehicleImagesFolder),
  fileFilter: checkImageType,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024 },
});

export const uploadAirportImages = multer({
  storage: createStorage(airportImagesFolder),
  fileFilter: checkImageType,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024, files: MAX_AIRPORT_IMAGES },
});

export const uploadStationImages = multer({
  storage: createStorage(stationImagesFolder),
  fileFilter: checkImageType,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024, files: MAX_STATION_IMAGES },
});

// Blog ke liye ek waqt me ek image (cover image, ya editor me lagane wali image)
export const uploadBlogImage = multer({
  storage: createStorage(blogImagesFolder),
  fileFilter: checkImageType,
  limits: {
    fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
    files: 1,
    fieldSize: MAX_BLOG_TEXT_FIELD_MB * 1024 * 1024,
  },
});
