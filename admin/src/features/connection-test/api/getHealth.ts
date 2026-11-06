import type { HealthData } from '../types/health'

// Backend ka URL .env file (VITE_API_URL) se aata hai, production me wahan live URL likhna
const API_URL = import.meta.env.VITE_API_URL

// Backend se health data mangta hai
export async function getHealth(): Promise<HealthData> {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error(`Server ne error diya: ${response.status}`)
  }

  return response.json()
}
