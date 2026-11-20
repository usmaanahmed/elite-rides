import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { TourFormValues, TourPriceFormValue } from '../types/tour'

type TourPricesInputProps = {
  // One row for every vehicle (from the form)
  rows: TourPriceFormValue[]
  register: UseFormRegister<TourFormValues>
  errors: FieldErrors<TourFormValues>
}

// One price box for each vehicle. Leave a box empty if that vehicle is not offered for this tour.
export function TourPricesInput({ rows, register, errors }: TourPricesInputProps) {
  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const priceError = errors.prices?.[index]?.price?.message
        const inputId = `tourPrice-${row.vehicleId}`

        return (
          <div key={row.vehicleId} className="grid grid-cols-[1fr_9rem] items-start gap-3">
            <label htmlFor={inputId} className="pt-3 text-sm font-medium text-ink">
              {row.vehicleName}
            </label>
            <div>
              <TextInput
                id={inputId}
                prefix="£"
                inputMode="decimal"
                placeholder="Not offered"
                autoComplete="off"
                {...register(`prices.${index}.price`)}
                hasError={!!priceError}
              />
              {priceError && (
                <p id={`${inputId}-error`} className="mt-1 text-xs font-medium text-danger">
                  {priceError}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
