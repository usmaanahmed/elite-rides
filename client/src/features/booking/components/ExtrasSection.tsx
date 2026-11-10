import { Minus, Plus } from 'lucide-react'
import { formatMoney } from '../../../shared/utils/formatMoney'
import type { BookingExtras } from '../types/journey'
import type { PublicSettings } from '../types/publicApi'

type ExtrasSectionProps = {
  extras: BookingExtras
  prices: PublicSettings['extraPrices']
  onChange: (extras: BookingExtras) => void
}

// The most of one counted extra a customer can add (the server allows up to 10 seats)
const MAX_COUNT = 4

// "£5.00 each" or "Free"
function describePrice(price: number, suffix: string): string {
  if (price <= 0) {
    return 'Free'
  }
  return formatMoney(price) + suffix
}

type CounterRowProps = {
  label: string
  priceText: string
  count: number
  onChange: (count: number) => void
}

// One extra that is counted, e.g. "Baby seat  [-] 1 [+]"
function CounterRow({ label, priceText, count, onChange }: CounterRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{priceText}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(count - 1)}
          disabled={count <= 0}
          aria-label={`Fewer: ${label}`}
          className="grid size-9 place-items-center rounded-full border border-line text-ink transition hover:border-accent disabled:opacity-40"
        >
          <Minus className="size-4" strokeWidth={2} />
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums">{count}</span>
        <button
          type="button"
          onClick={() => onChange(count + 1)}
          disabled={count >= MAX_COUNT}
          aria-label={`More: ${label}`}
          className="grid size-9 place-items-center rounded-full border border-line text-ink transition hover:border-accent disabled:opacity-40"
        >
          <Plus className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

type ToggleRowProps = {
  label: string
  priceText: string
  isOn: boolean
  onChange: (isOn: boolean) => void
}

// One extra that is simply on or off, e.g. "Meet & greet"
function ToggleRow({ label, priceText, isOn, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-3">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-muted">{priceText}</span>
      </span>
      <input
        type="checkbox"
        checked={isOn}
        onChange={(event) => onChange(event.target.checked)}
        className="size-5 cursor-pointer accent-accent"
      />
    </label>
  )
}

// The extras the customer can add. Every change asks the server for a new price.
export function ExtrasSection({ extras, prices, onChange }: ExtrasSectionProps) {
  return (
    <div className="divide-y divide-line">
      <CounterRow
        label="Baby seat"
        priceText={describePrice(prices.babySeatPrice, ' each')}
        count={extras.babySeats}
        onChange={(count) => onChange({ ...extras, babySeats: count })}
      />
      <CounterRow
        label="Booster seat"
        priceText={describePrice(prices.boosterSeatPrice, ' each')}
        count={extras.boosterSeats}
        onChange={(count) => onChange({ ...extras, boosterSeats: count })}
      />
      <CounterRow
        label="Extra luggage"
        priceText={describePrice(prices.luggagePrice, ' per item')}
        count={extras.extraLuggage}
        onChange={(count) => onChange({ ...extras, extraLuggage: count })}
      />
      <CounterRow
        label="Special luggage (golf bags, skis…)"
        priceText={describePrice(prices.specialLuggagePrice, ' per item')}
        count={extras.specialLuggage}
        onChange={(count) => onChange({ ...extras, specialLuggage: count })}
      />
      <ToggleRow
        label="Meet & greet"
        priceText={describePrice(prices.meetAndGreetPrice, '')}
        isOn={extras.meetAndGreet}
        onChange={(isOn) => onChange({ ...extras, meetAndGreet: isOn })}
      />
      <ToggleRow
        label="Wheelchair accessible"
        priceText={describePrice(prices.wheelchairPrice, '')}
        isOn={extras.wheelchair}
        onChange={(isOn) => onChange({ ...extras, wheelchair: isOn })}
      />
    </div>
  )
}
