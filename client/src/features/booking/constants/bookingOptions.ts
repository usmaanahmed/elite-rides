import { buildNumberOptions } from '../utils/buildNumberOptions'

// Most stops a visitor can add between pickup and drop-off
export const MAX_STOPS = 3

// Time dropdowns: hours 00–23, minutes in 5-minute steps
export const HOUR_OPTIONS = buildNumberOptions(0, 23, 1, true, '')
export const MINUTE_OPTIONS = buildNumberOptions(0, 55, 5, true, '')

// Used until the admin settings (with the real "Max Passengers") have loaded
export const DEFAULT_MAX_PASSENGERS = 20
export const LUGGAGE_OPTIONS = buildNumberOptions(0, 20, 1, false, '')

// Hourly hire: 2 hours minimum, up to 12
export const DURATION_OPTIONS = buildNumberOptions(2, 12, 1, false, ' hours')
