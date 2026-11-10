import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSettings, saveSettings } from '../api/settingsApi'

// The name React Query uses to store the settings in its cache
export const SETTINGS_QUERY_KEY = ['settings']

// Loads the settings. Gives back the settings plus loading / error info.
export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSettings,
  })
}

// Saves all the settings, then reloads them
export function useSaveSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY }),
  })
}
