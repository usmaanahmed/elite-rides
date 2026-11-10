import { ArrowDownUp } from 'lucide-react'
import type { FocusEvent, KeyboardEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete'
import type { TransferFormValues } from '../schemas/transferFormSchema'
import { AddressSuggestionList } from './AddressSuggestionList'
import { FieldError } from './FieldError'
import { LocationRow } from './LocationRow'

// The address boxes of the Transfer tab, by their form field name
export type AddressFieldName = 'pickup' | 'dropoff' | `stops.${number}.address`

type RouteFieldsProps = {
  register: UseFormRegister<TransferFormValues>
  errors: FieldErrors<TransferFormValues>
  // Stops from useFieldArray; `id` is a stable key React Hook Form creates for each one
  stops: { id: string }[]
  onRemoveStop: (index: number) => void
  onSwap: () => void
  // Called when the customer picks a suggested address
  onAddressSelect: (fieldName: AddressFieldName, address: string) => void
}

// Kept short so it still fits next to the swap button on small phones (360px wide)
const PLACEHOLDER = 'Address or postcode'
// Every row in the route box is 60px tall
const ROW_HEIGHT = 60

// The route box of the Transfer tab: pickup, any stops, and drop-off in one card,
// joined by a dotted line on the left like a journey timeline.
// Typing in a box shows saved airports/stations and Google's address suggestions under it.
export function RouteFields({ register, errors, stops, onRemoveStop, onSwap, onAddressSelect }: RouteFieldsProps) {
  const autocomplete = useAddressAutocomplete()

  const pickupError = errors.pickup?.message
  const dropoffError = errors.dropoff?.message
  const hasError = Boolean(pickupError || dropoffError || errors.stops)

  // Swapping is only offered for a simple A -> B trip
  const canSwap = stops.length === 0

  const borderClasses = hasError
    ? 'border-danger/60 focus-within:ring-danger/10'
    : 'border-line focus-within:border-accent/50 focus-within:ring-accent/10'

  // The error message for one stop, if it has one
  function getStopError(index: number): string | undefined {
    return errors.stops?.[index]?.address?.message
  }

  // Input props for one address box: the form's own props plus the suggestion list behaviour
  function getAddressInputProps(fieldName: AddressFieldName, rowIndex: number) {
    return {
      ...register(fieldName, {
        onChange: (event: { target: { value: string } }) => autocomplete.changeText(event.target.value),
        onBlur: () => autocomplete.close(),
      }),
      onFocus: (event: FocusEvent<HTMLInputElement>) =>
        autocomplete.openFor({ name: fieldName, rowIndex: rowIndex }, event.target.value),
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
          autocomplete.close()
        }
      },
    }
  }

  function handleSelect(address: string): void {
    if (!autocomplete.activeField) {
      return
    }
    onAddressSelect(autocomplete.activeField.name as AddressFieldName, address)
    autocomplete.finishSelection()
  }

  const dropoffRowIndex = stops.length + 1

  return (
    <div className="relative">
      <div className={`relative overflow-hidden rounded-2xl border bg-surface-muted transition focus-within:ring-4 ${borderClasses}`}>
        {/* Dotted line from the pickup marker down to the drop-off marker (each row is 60px, so 30px = row centre) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[30px] left-[25px] top-[30px] z-10 border-l-[1.5px] border-dashed border-muted/40"
        />

        <LocationRow
          id="transfer-pickup"
          label="Pickup"
          marker="pickup"
          placeholder={PLACEHOLDER}
          hasError={Boolean(pickupError)}
          {...getAddressInputProps('pickup', 0)}
        />

        {stops.map((stop, index) => (
          <LocationRow
            key={stop.id}
            id={`transfer-stop-${index}`}
            label={`Stop ${index + 1}`}
            marker="stop"
            placeholder="Add a stop on the way"
            hasError={Boolean(getStopError(index))}
            showDivider
            onRemove={() => onRemoveStop(index)}
            removeLabel={`Remove stop ${index + 1}`}
            {...getAddressInputProps(`stops.${index}.address`, index + 1)}
          />
        ))}

        <LocationRow
          id="transfer-dropoff"
          label="Drop-off"
          marker="dropoff"
          placeholder={PLACEHOLDER}
          hasError={Boolean(dropoffError)}
          showDivider
          {...getAddressInputProps('dropoff', dropoffRowIndex)}
        />

        {/* Swap button sits on the line between the two rows (60px = height of the first row) */}
        {canSwap && (
          <button
            type="button"
            onClick={onSwap}
            aria-label="Swap pickup and drop-off"
            className="absolute right-3 top-[60px] z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-sm transition hover:border-accent hover:text-accent-ink"
          >
            <ArrowDownUp className="size-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* The list sits outside the route box (which clips its corners), just under the active row */}
      {autocomplete.activeField && (
        <AddressSuggestionList
          savedAddresses={autocomplete.savedAddresses}
          googleAddresses={autocomplete.googleAddresses}
          top={(autocomplete.activeField.rowIndex + 1) * ROW_HEIGHT + 6}
          onSelect={handleSelect}
        />
      )}

      <FieldError id="transfer-pickup-error" message={pickupError} />
      {stops.map((stop, index) => (
        <FieldError key={stop.id} id={`transfer-stop-${index}-error`} message={getStopError(index)} />
      ))}
      <FieldError id="transfer-dropoff-error" message={dropoffError} />
    </div>
  )
}
