// Google se pickup -> (via) -> dropoff ka driving distance miles me nikalta hai
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import { roundMoney } from "../../utils/roundMoney.js";

const METERS_PER_MILE = 1609.344;

function metersToMiles(meters: number): number {
  return roundMoney(meters / METERS_PER_MILE);
}

// Naya Google Routes API. Key ko yeh API enable hona chahiye
async function getMilesFromRoutesApi(pickup: string, via: string[], dropoff: string): Promise<number> {
  const intermediates = via.map((stop) => ({ address: stop }));

  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": env.googleMapsApiKey,
      "X-Goog-FieldMask": "routes.distanceMeters",
    },
    body: JSON.stringify({
      origin: { address: pickup },
      destination: { address: dropoff },
      intermediates: intermediates,
      travelMode: "DRIVE",
      regionCode: "GB",
    }),
  });

  if (response.status === 403 || response.status === 401) {
    throw new Error("ROUTES_API_DENIED");
  }
  if (!response.ok) {
    throw new AppError("Could not find a route between these addresses", 400);
  }

  const data = (await response.json()) as { routes?: { distanceMeters?: number }[] };
  const meters = data.routes?.[0]?.distanceMeters;
  if (meters === undefined) {
    throw new AppError("Could not find a route between these addresses", 400);
  }
  return metersToMiles(meters);
}

// Purana Google Directions API (agar Routes API key par enable na ho)
async function getMilesFromDirectionsApi(pickup: string, via: string[], dropoff: string): Promise<number> {
  const params = new URLSearchParams({
    origin: pickup,
    destination: dropoff,
    region: "gb",
    key: env.googleMapsApiKey,
  });
  if (via.length > 0) {
    params.set("waypoints", via.join("|"));
  }

  const response = await fetch("https://maps.googleapis.com/maps/api/directions/json?" + params.toString());
  const data = (await response.json()) as {
    status: string;
    routes?: { legs: { distance: { value: number } }[] }[];
  };

  if (data.status === "ZERO_RESULTS" || data.status === "NOT_FOUND") {
    throw new AppError("Could not find a route between these addresses", 400);
  }
  if (data.status !== "OK" || !data.routes || data.routes.length === 0) {
    console.error("Google Directions API error:", data.status);
    throw new AppError("Distance service is not available right now", 502);
  }

  let meters = 0;
  for (const leg of data.routes[0].legs) {
    meters = meters + leg.distance.value;
  }
  return metersToMiles(meters);
}

export async function getDistanceInMiles(pickup: string, via: string[], dropoff: string): Promise<number> {
  if (env.googleMapsApiKey === "") {
    throw new AppError("Distance service is not set up (GOOGLE_MAPS_API_KEY is missing in server/.env)", 500);
  }

  try {
    return await getMilesFromRoutesApi(pickup, via, dropoff);
  } catch (error) {
    // Routes API ki permission nahi to purani Directions API try karo
    if (error instanceof Error && error.message === "ROUTES_API_DENIED") {
      return getMilesFromDirectionsApi(pickup, via, dropoff);
    }
    throw error;
  }
}
