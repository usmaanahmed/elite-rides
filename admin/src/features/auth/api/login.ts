import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { LoginInput, LoginResult } from '../types/auth'

// Email + password server ko bhejta hai, token + admin details wapas aate hain
export async function login(input: LoginInput): Promise<LoginResult> {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return (await readJsonResponse(response)) as LoginResult
}
