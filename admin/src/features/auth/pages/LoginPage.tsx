import { zodResolver } from '@hookform/resolvers/zod'
import { CarFront } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button } from '../../../shared/components/buttons/Button'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { useAuth } from '../../../shared/auth/AuthContext'
import { ROUTES } from '../../../shared/constants/routes'
import { loginFormSchema, type LoginFormValues } from '../schemas/loginFormSchema'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  // Only runs once email + password have passed validation
  async function handleLogin(values: LoginFormValues) {
    try {
      await login(values)
      navigate(ROUTES.dashboard)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not log in. Please try again.'
      setError('root', { message })
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-[#ff8a3d] to-[#e04f00] text-white shadow-[0_6px_16px_-6px_rgba(252,98,3,0.7)]">
            <CarFront className="size-5" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-lg font-semibold tracking-tight text-ink">Elite Rides Admin</h1>
          <p className="mt-1 text-sm text-muted">Log in to manage bookings, vehicles and more.</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} noValidate className="mt-7 space-y-4">
          {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@eliterides.com"
              {...register('email')}
              hasError={!!errors.email}
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <TextInput
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              hasError={!!errors.password}
            />
          </FormField>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
