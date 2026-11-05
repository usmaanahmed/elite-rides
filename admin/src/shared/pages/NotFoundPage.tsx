import { Home } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '../components/buttons/Button'
import { Card } from '../components/cards/Card'
import { ROUTES } from '../constants/routes'

// Shown when the URL does not match any route
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col items-center py-16 text-center">
      <p className="text-5xl font-semibold tracking-tight text-accent">404</p>
      <h1 className="mt-4 text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-1.5 text-sm text-muted">The page you are looking for does not exist or has been moved.</p>
      <div className="mt-6">
        <Button icon={Home} onClick={() => navigate(ROUTES.dashboard)}>
          Back to dashboard
        </Button>
      </div>
    </Card>
  )
}
