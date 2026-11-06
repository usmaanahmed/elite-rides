// Request lo, service se data lo, JSON bhej do
import { Request, Response } from "express";
import { getHealthData } from "./health.service.js";

export function getHealth(req: Request, res: Response) {
  const data = getHealthData();
  res.json(data);
}
