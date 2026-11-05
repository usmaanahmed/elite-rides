// "2026-03-05T22:00" → { date: '05-03-2026', time: '22:00' }
export function formatPickupDateTime(pickupAt: string) {
  const [datePart, timePart = ''] = pickupAt.split('T')
  const [year, month, day] = datePart.split('-')
  return { date: `${day}-${month}-${year}`, time: timePart.slice(0, 5) }
}

// 749.11 → "£749.11"
export function formatFare(fare: number) {
  return `£${fare.toFixed(2)}`
}
