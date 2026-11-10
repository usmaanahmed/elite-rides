import type { Settings, SettingsFormValues } from '../types/settings'

// Turns the saved settings into form values (numbers become text for the inputs)
export function settingsToFormValues(settings: Settings): SettingsFormValues {
  return {
    office: settings.office,
    pricing: settings.pricing,
    extras: {
      babySeatPrice: String(settings.extras.babySeatPrice),
      boosterSeatPrice: String(settings.extras.boosterSeatPrice),
      meetAndGreetPrice: String(settings.extras.meetAndGreetPrice),
      luggagePrice: String(settings.extras.luggagePrice),
      specialLuggagePrice: String(settings.extras.specialLuggagePrice),
      wheelchairPrice: String(settings.extras.wheelchairPrice),
      returnExtraPrice: String(settings.extras.returnExtraPrice),
      waitingPricePer5Minutes: String(settings.extras.waitingPricePer5Minutes),
    },
    general: {
      ...settings.general,
      graceTimeMinutes: String(settings.general.graceTimeMinutes),
      maxPassengers: String(settings.general.maxPassengers),
    },
    discount: {
      globalDiscountType: settings.discount.globalDiscountType,
      globalDiscountValue: String(settings.discount.globalDiscountValue),
      pretendDiscountType: settings.discount.pretendDiscountType,
      pretendDiscountValue: String(settings.discount.pretendDiscountValue),
    },
  }
}

// Turns the form values back into settings ready to send to the server (text becomes numbers)
export function formValuesToSettings(values: SettingsFormValues): Settings {
  return {
    office: values.office,
    pricing: values.pricing,
    extras: {
      babySeatPrice: Number(values.extras.babySeatPrice),
      boosterSeatPrice: Number(values.extras.boosterSeatPrice),
      meetAndGreetPrice: Number(values.extras.meetAndGreetPrice),
      luggagePrice: Number(values.extras.luggagePrice),
      specialLuggagePrice: Number(values.extras.specialLuggagePrice),
      wheelchairPrice: Number(values.extras.wheelchairPrice),
      returnExtraPrice: Number(values.extras.returnExtraPrice),
      waitingPricePer5Minutes: Number(values.extras.waitingPricePer5Minutes),
    },
    general: {
      ...values.general,
      graceTimeMinutes: Number(values.general.graceTimeMinutes),
      maxPassengers: Number(values.general.maxPassengers),
    },
    discount: {
      globalDiscountType: values.discount.globalDiscountType,
      globalDiscountValue: Number(values.discount.globalDiscountValue),
      pretendDiscountType: values.discount.pretendDiscountType,
      pretendDiscountValue: Number(values.discount.pretendDiscountValue),
    },
  }
}
