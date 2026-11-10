// Doosre modules ke liye chhote sawal ("is vehicle ki active bookings hain?").
// Alag file isliye hai ke vehicle module booking.service (jo quote -> vehicle service use karti hai) ko import na kare
import { countActiveBookingsByVehicle } from "./booking.repository.js";

// true ho to vehicle delete nahi honi chahiye
export async function hasActiveBookingsForVehicle(vehicleId: string): Promise<boolean> {
  const count = await countActiveBookingsByVehicle(vehicleId);
  return count > 0;
}
