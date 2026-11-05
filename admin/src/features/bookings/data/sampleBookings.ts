import type { Booking, PaymentMethod } from '../types/booking'

// Placeholder bookings so the table has something to show.
// TODO: remove once bookings are loaded from the backend.
export const SAMPLE_BOOKINGS: Booking[] = (
  [
    ['ELR001663', 'Doris Motta', '2026-03-05T22:00', 'Heathrow Terminals 2 & 3 Station, Hounslow, UK', '12 Ainslie Wood Rd, London E4 9BY, UK', 'Saloon', 'pay_card', 74],
    ['ELR014261', 'Zeeshan Rana', '2025-10-17T23:04', 'High Wycombe HP12, UK', '123 York St, Belfast BT15 1AS, UK', 'Saloon', 'pay_card', 749.11],
    ['ELR086628', 'Shi Yong Lee', '2026-02-28T09:00', 'North Terminal, Departures Rd, Horley, Gatwick RH6 0NP, UK', 'IG11 7US', 'MPV', 'pay_card', 93.6],
    ['ELR106833', 'Ani', '2025-12-05T03:00', '3 Ignatius Sancho Rd, London SE3, UK', 'LHR Terminal 2, Inner Ring E, Hounslow TW6 1EW, UK', 'Saloon', 'pay_card', 65],
    ['ELR112907', 'James Whitaker', '2026-01-14T06:30', '45 Baker St, London W1U 8EW, UK', 'Stansted Airport, Bassingbourn Rd, CM24 1QW, UK', 'Executive', 'pay_card', 118.5],
    ['ELR120455', 'Priya Sharma', '2026-04-02T14:15', 'London City Airport, Hartmann Rd, E16 2PX, UK', '221 Kensington High St, London W8 6SG, UK', 'Saloon', 'pay_cash', 48],
    ['ELR133018', 'Tomasz Nowak', '2026-02-11T05:45', 'Luton Airport, Airport Way, LU2 9LY, UK', '18 Station Rd, Watford WD17 1EU, UK', 'Estate', 'pay_card', 56.4],
    ['ELR140276', 'Fatima Hussain', '2026-05-20T19:00', 'Heathrow Terminal 5, Wallis Rd, TW6 2GA, UK', '7 Queens Rd, Reading RG1 4AR, UK', 'MPV', 'pay_card', 82],
    ['ELR152839', 'Oliver Bennett', '2025-11-29T11:20', 'Canary Wharf, London E14 5AB, UK', 'Gatwick South Terminal, RH6 0NP, UK', 'Executive MPV', 'pay_card', 154.75],
    ['ELR167401', 'Grace Okafor', '2026-03-18T08:10', '10 Downing St, London SW1A 2AA, UK', 'St Pancras International, Euston Rd, N1C 4QP, UK', 'Saloon', 'pay_cash', 32],
    ['ELR178562', 'Mohammed Ali', '2026-06-01T16:40', 'Birmingham Airport, B26 3QJ, UK', '1 Broad St, Birmingham B1 2HF, UK', 'Saloon', 'pay_card', 38.9],
    ['ELR189034', 'Sophie Laurent', '2026-01-03T21:30', 'Eurostar, St Pancras, London N1C 4QP, UK', 'The Savoy, Strand, London WC2R 0EZ, UK', 'Luxury', 'pay_card', 95],
  ] as const
).map(([orderNo, passengerName, pickupAt, pickupAddress, dropoffAddress, vehicleName, paymentMethod, fare], index) => ({
  id: `sample-${index + 1}`,
  orderNo,
  passengerName,
  pickupAt,
  pickupAddress,
  dropoffAddress,
  vehicleName,
  paymentMethod: paymentMethod as PaymentMethod,
  fare,
}))
