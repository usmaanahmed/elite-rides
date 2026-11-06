// Multer ki setting: car image ko disk par save karta hai
import fs from "fs";
import multer from "multer";
import path from "path";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const MAX_IMAGE_SIZE_MB = 2;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

// Vehicle images is folder me jaengi: uploads/vehicles
export const vehicleImagesFolder = path.join(env.uploadsFolder, "vehicles");
fs.mkdirSync(vehicleImagesFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, vehicleImagesFolder);
  },
  // Unique naam banao taake do files ka naam kabhi same na ho
  filename: (req, file, callback) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1000000);
    callback(null, uniqueName + path.extname(file.originalname).toLowerCase());
  },
});

// Sirf JPG, PNG aur WEBP images allow hain
function checkImageType(req: unknown, file: Express.Multer.File, callback: multer.FileFilterCallback) {
  if (allowedImageTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new AppError("Use a JPG, PNG or WEBP image", 400));
  }
}

export const uploadVehicleImage = multer({
  storage: storage,
  fileFilter: checkImageType,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024 },
});
