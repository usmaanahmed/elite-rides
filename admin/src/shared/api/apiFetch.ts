import { getToken } from '../auth/tokenStorage'
import { API_URL } from './apiUrl'

// fetch jaisa hi hai, lekin saved login token (agar mojood ho) Authorization header me khud laga deta hai
export function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(`${API_URL}${path}`, { ...options, headers })
}
