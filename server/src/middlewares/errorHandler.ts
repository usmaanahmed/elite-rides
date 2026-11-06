// Saray errors yahan aa kar handle hotay hain
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";
import { MAX_IMAGE_SIZE_MB } from "./upload.js";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  // Humara apna error (status code ke saath)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  // Multer ka error, e.g. image bohat bari hai
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ message: "Image must be " + MAX_IMAGE_SIZE_MB + " MB or smaller" });
    } else {
      res.status(400).json({ message: error.message });
    }
    return;
  }

  console.log(error);
  res.status(500).json({ message: error.message || "Something went wrong" });
}
