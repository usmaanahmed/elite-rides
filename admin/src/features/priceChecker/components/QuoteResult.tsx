import { Button } from '../../../shared/components/buttons/Button'
import { Card } from '../../../shared/components/cards/Card'
import { formatPounds } from '../../../shared/utils/formatNumbers'
import type { Quote } from '../types/quote'

type QuoteResultProps = {
  quote: Quote
  // When given, every available vehicle gets a "Book this vehicle" button
  onSelectVehicle?: (vehicleId: string) => void
}

// Shows the price of every vehicle with its full breakdown
export function QuoteResult({ quote, onSelectVehicle }: QuoteResultProps) {
  let distanceText = ''
  if (quote.tripType !== 'hourly') {
    distanceText = `Distance: ${quote.distanceMiles} miles`
  }

  return (
    <div className="space-y-4">
      {distanceText && <p className="text-sm text-muted">{distanceText}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {quote.vehicles.map((vehicle) => (
          <Card key={vehicle.vehicleId}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{vehicle.vehicleName}</h3>
              {vehicle.available && (
                <p className="text-lg font-semibold tabular-nums text-ink">{formatPounds(vehicle.total)}</p>
              )}
            </div>

            {!vehicle.available && <p className="mt-2 text-sm text-muted">Not available: {vehicle.unavailableReason}</p>}

            {vehicle.available && (
              <ul className="mt-3 divide-y divide-line text-sm">
                {vehicle.lines.map((line, index) => (
                  <li key={index} className="flex justify-between gap-3 py-1.5">
                    <span className="text-muted">{line.label}</span>
                    <span className="tabular-nums text-ink">
                      {line.amount < 0 ? '−' : ''}
                      {formatPounds(Math.abs(line.amount))}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {vehicle.available && onSelectVehicle && (
              <Button className="mt-4 w-full" onClick={() => onSelectVehicle(vehicle.vehicleId)}>
                Book this vehicle
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
