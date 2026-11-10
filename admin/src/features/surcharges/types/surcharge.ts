// Types shared by all three surcharge pages

// Inactive surcharges are kept but never added to a fare
export type SurchargeStatus = 'active' | 'inactive'

// fixed = a flat amount in pounds, percent = a percentage of the fare
export type SurchargeAmountType = 'fixed' | 'percent'
