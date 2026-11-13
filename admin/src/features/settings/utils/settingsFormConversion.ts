import type { Settings, SettingsFormValues } from '../types/settings'

// Turns the saved settings into form values (numbers become text for the inputs)
export function settingsToFormValues(settings: Settings): SettingsFormValues {
  return {
    office: settings.office,
    pricing: {
      mileageBySlabs: settings.pricing.mileageBySlabs,
      roundOff: settings.pricing.roundOff,
      setPrice: settings.pricing.setPrice,
      showCard: settings.pricing.showCard,
      singleRates: {
        fixedPrice: String(settings.pricing.singleRates.fixedPrice),
        mileageBands: settings.pricing.singleRates.mileageBands.map((band) => ({
          fromMiles: String(band.fromMiles),
          toMiles: String(band.toMiles),
          ratePerMile: String(band.ratePerMile),
        })),
        slabBands: settings.pricing.singleRates.slabBands.map((band) => ({
          fromMiles: String(band.fromMiles),
          toMiles: String(band.toMiles),
          price: String(band.price),
        })),
      },
    },
    extras: {
      babySeatPrice: String(settings.extras.babySeatPrice),
      boosterSeatPrice: String(settings.extras.boosterSeatPrice),
      meetAndGreetPrice: String(settings.extras.meetAndGreetPrice),
      luggagePrice: String(settings.extras.luggagePrice),
      specialLuggagePrice: String(settings.extras.specialLuggagePrice),
      wheelchairPrice: String(settings.extras.wheelchairPrice),
      petPrice: String(settings.extras.petPrice),
      returnExtraPrice: String(settings.extras.returnExtraPrice),
      waitingPricePer5Minutes: String(settings.extras.waitingPricePer5Minutes),
      viaPrice: String(settings.extras.viaPrice),
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
    pricing: {
      mileageBySlabs: values.pricing.mileageBySlabs,
      roundOff: values.pricing.roundOff,
      setPrice: values.pricing.setPrice,
      showCard: values.pricing.showCard,
      singleRates: {
        fixedPrice: Number(values.pricing.singleRates.fixedPrice),
        mileageBands: values.pricing.singleRates.mileageBands.map((band) => ({
          fromMiles: Number(band.fromMiles),
          toMiles: Number(band.toMiles),
          ratePerMile: Number(band.ratePerMile),
        })),
        slabBands: values.pricing.singleRates.slabBands.map((band) => ({
          fromMiles: Number(band.fromMiles),
          toMiles: Number(band.toMiles),
          price: Number(band.price),
        })),
      },
    },
    extras: {
      babySeatPrice: Number(values.extras.babySeatPrice),
      boosterSeatPrice: Number(values.extras.boosterSeatPrice),
      meetAndGreetPrice: Number(values.extras.meetAndGreetPrice),
      luggagePrice: Number(values.extras.luggagePrice),
      specialLuggagePrice: Number(values.extras.specialLuggagePrice),
      wheelchairPrice: Number(values.extras.wheelchairPrice),
      petPrice: Number(values.extras.petPrice),
      returnExtraPrice: Number(values.extras.returnExtraPrice),
      waitingPricePer5Minutes: Number(values.extras.waitingPricePer5Minutes),
      viaPrice: Number(values.extras.viaPrice),
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
