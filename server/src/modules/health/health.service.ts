// Business logic: server ki health ka data tayar karna
import { HealthData } from "./health.types.js";

export function getHealthData(): HealthData {
  return {
    status: "ok",
    message: "Elite Rides backend is working",
    serverTime: new Date().toISOString(),
  };
}
