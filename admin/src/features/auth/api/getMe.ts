import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Admin } from '../types/auth'

// Saved login token se logged-in admin ki details mangta hai
export async function getMe(): Promise<Admin> {
  const response = await apiFetch('/auth/me')
  return (await readJsonResponse(response)) as Admin
}
