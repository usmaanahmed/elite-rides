import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getMe } from '../../features/auth/api/getMe'
import { login as loginRequest } from '../../features/auth/api/login'
import type { Admin, LoginInput } from '../../features/auth/types/auth'
import { clearToken, getToken, setToken } from './tokenStorage'

type AuthContextValue = {
  admin: Admin | null
  // True while checking a saved token on first load
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On app start: if a token was saved from a previous visit, check it is still valid
  useEffect(() => {
    async function loadAdmin() {
      if (!getToken()) {
        setIsLoading(false)
        return
      }

      try {
        const loadedAdmin = await getMe()
        setAdmin(loadedAdmin)
      } catch {
        clearToken()
      } finally {
        setIsLoading(false)
      }
    }

    loadAdmin()
  }, [])

  async function login(input: LoginInput) {
    const result = await loginRequest(input)
    setToken(result.token)
    setAdmin(result.admin)
  }

  function logout() {
    clearToken()
    setAdmin(null)
  }

  return <AuthContext.Provider value={{ admin, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
