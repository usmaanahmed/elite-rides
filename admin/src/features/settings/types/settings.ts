// "none" = koi discount nahi
export type DiscountType = 'none' | 'fixed' | 'percent'

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
    showPayInCar: boolean
  }
  extras: {
    babySeatPrice: number
    boosterSeatPrice: number
    meetAndGreetPrice: number
    luggagePrice: number
    specialLuggagePrice: number
    wheelchairPrice: number
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
  pricing: Settings['pricing']
  extras: {
    babySeatPrice: string
    boosterSeatPrice: string
    meetAndGreetPrice: string
    luggagePrice: string
    specialLuggagePrice: string
    wheelchairPrice: string
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
