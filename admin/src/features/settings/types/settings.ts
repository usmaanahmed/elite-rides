// "none" = koi discount nahi
export type DiscountType = 'none' | 'fixed' | 'percent'

// "Single price" mode ka shared rate table (saari vehicles ke liye)
export type SingleRates = {
  fixedPrice: number
  mileageBands: { fromMiles: number; toMiles: number; ratePerMile: number }[]
  slabBands: { fromMiles: number; toMiles: number; price: number }[]
}

// Single rates jaisa form me hai (numbers text hain)
export type SingleRatesFormValues = {
  fixedPrice: string
  mileageBands: { fromMiles: string; toMiles: string; ratePerMile: string }[]
  slabBands: { fromMiles: string; toMiles: string; price: string }[]
}

// Settings exactly jaisi server par saved hain (numbers asli numbers hain)
export type Settings = {
  office: {
    companyName: string
    appName: string
    currency: string
    companyEmail: string
    fromEmail: string
    siteUrl: string
  }
  pricing: {
    mileageBySlabs: boolean
    roundOff: boolean
    setPrice: 'per_vehicle' | 'single_price'
    showCard: boolean
    showCash: boolean
    singleRates: SingleRates
  }
  extras: {
    babySeatPrice: number
    boosterSeatPrice: number
    meetAndGreetPrice: number
    luggagePrice: number
    specialLuggagePrice: number
    wheelchairPrice: number
    petPrice: number
    returnExtraPrice: number
    waitingPricePer5Minutes: number
    viaPrice: number
  }
  general: {
    guestLogin: boolean
    hourlyRateStatus: boolean
    isQuotation: boolean
    graceTimeMinutes: number
    maxPassengers: number
    bookingNumberPrefix: string
    // Khaali text = woh option band
    blockDateFrom: string
    blockDateTo: string
    blockTimeFrom: string
    blockTimeTo: string
    bookingSuccessRedirectUrl: string
  }
  discount: {
    globalDiscountType: DiscountType
    globalDiscountValue: number
    pretendDiscountType: DiscountType
    pretendDiscountValue: number
  }
}

// Settings form ki values: numbers typing ke waqt text rehte hain
export type SettingsFormValues = {
  office: Settings['office']
  pricing: {
    mileageBySlabs: boolean
    roundOff: boolean
    setPrice: 'per_vehicle' | 'single_price'
    showCard: boolean
    showCash: boolean
    singleRates: SingleRatesFormValues
  }
  extras: {
    babySeatPrice: string
    boosterSeatPrice: string
    meetAndGreetPrice: string
    luggagePrice: string
    specialLuggagePrice: string
    wheelchairPrice: string
    petPrice: string
    returnExtraPrice: string
    waitingPricePer5Minutes: string
    viaPrice: string
  }
  general: {
    guestLogin: boolean
    hourlyRateStatus: boolean
    isQuotation: boolean
    graceTimeMinutes: string
    maxPassengers: string
    bookingNumberPrefix: string
    blockDateFrom: string
    blockDateTo: string
    blockTimeFrom: string
    blockTimeTo: string
    bookingSuccessRedirectUrl: string
  }
  discount: {
    globalDiscountType: DiscountType
    globalDiscountValue: string
    pretendDiscountType: DiscountType
    pretendDiscountValue: string
  }
}
