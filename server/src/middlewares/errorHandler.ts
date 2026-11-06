// Saray errors yahan aa kar handle hotay hain
import { Request, Response, NextFunction } from "express";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.log(error);
  res.status(500).json({ message: error.message || "Something went wrong" });
}
