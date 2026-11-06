import { useState } from 'react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { getHealth } from '../api/getHealth'
import type { HealthData } from '../types/health'

// Is page se backend ka connection aur CORS check hota hai
export function ApiTestPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleTestClick() {
    setIsLoading(true)
    setErrorMessage('')
    setData(null)

    try {
      const result = await getHealth()
      setData(result)
    } catch (error) {
      // CORS block ho to browser yahan "Failed to fetch" deta hai
      setErrorMessage(error instanceof Error ? error.message : 'Kuch ghalat hua')
    }

    setIsLoading(false)
  }

  return (
    <>
      <PageHeader title="API Test" description="Backend connection aur CORS check karein." />

      <p className="mt-6 text-sm">API URL: {import.meta.env.VITE_API_URL}</p>

      <button
        onClick={handleTestClick}
        disabled={isLoading}
        className="mt-4 rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? 'Checking...' : 'Test Backend'}
      </button>

      {data && (
        <pre className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-800">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      {errorMessage && (
        <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed: {errorMessage} (agar "Failed to fetch" hai to CORS ya server band hai)
        </p>
      )}
    </>
  )
}
