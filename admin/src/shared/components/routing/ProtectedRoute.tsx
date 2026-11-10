import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import { ROUTES } from '../../constants/routes'

// Blocks the pages inside it from anyone who is not logged in
export function ProtectedRoute() {
  const { admin, isLoading } = useAuth()

  // Still checking a saved token, so we don't know yet
  if (isLoading) return null

  if (!admin) return <Navigate to={ROUTES.login} replace />

  return <Outlet />
}
