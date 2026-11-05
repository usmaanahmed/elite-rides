import type { Vehicle } from '../types/vehicle'

// Placeholder vehicles so the table has something to show.
// TODO: remove once vehicles are loaded from the backend.
export const SAMPLE_VEHICLES: Vehicle[] = [
  ['Saloon', '1001', 'Toyota Prius or similar. Ideal for up to 4 passengers with light luggage.', 4, 2],
  ['Estate', '1002', 'Extra boot space for airport runs with more bags.', 4, 4],
  ['Executive', '1003', 'Mercedes E-Class or similar, for business travel.', 4, 2],
  ['MPV', '1004', 'Six seats with room for medium luggage.', 6, 4],
  ['Executive MPV', '1005', 'Mercedes V-Class or similar, premium group travel.', 7, 6],
  ['8 Seater', '1006', 'Ford Tourneo or similar, for larger groups.', 8, 8],
  ['Minibus', '1007', 'Up to 16 passengers with plenty of luggage room.', 16, 16],
  ['Luxury', '1008', 'Mercedes S-Class or similar.', 3, 2],
  ['Wheelchair Accessible', '1009', 'Ramp access with space for one wheelchair.', 4, 2],
  ['Estate Plus', '1010', '', 4, 5],
  ['Coach', '1011', 'For events and large group transfers.', 49, 49],
  ['Eco Saloon', '1012', 'Fully electric saloon.', 4, 2],
].map(([name, tbmsId, description, passengerCapacity, luggageCapacity], index) => ({
  id: `sample-${index + 1}`,
  tbmsId: String(tbmsId),
  name: String(name),
  description: String(description),
  passengerCapacity: Number(passengerCapacity),
  luggageCapacity: Number(luggageCapacity),
  handLuggageCapacity: Number(passengerCapacity),
  discountRate: 0,
  returnDiscountRate: 0,
  imageUrl: null,
}))
