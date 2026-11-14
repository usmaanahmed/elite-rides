import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { useAuth } from '../../../shared/auth/AuthContext'
import { ROUTES } from '../../../shared/constants/routes'
import { loginFormSchema, type LoginFormValues } from '../schemas/loginFormSchema'
import { LoginInput } from './LoginInput'
import { PasswordVisibilityButton } from './PasswordVisibilityButton'

// Email + password form. Logs the admin in, then opens the dashboard.
export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

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
      const message = error instanceof Error ? error.message : 'Could not sign in. Please try again.'
      setError('root', { message })
    }
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)} noValidate className="space-y-5">
      {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

      <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
        <LoginInput
          id="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          placeholder="you@elitelondonrides.com"
          {...register('email')}
          hasError={!!errors.email}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <LoginInput
          id="password"
          type={isPasswordVisible ? 'text' : 'password'}
          icon={LockKeyhole}
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register('password')}
          hasError={!!errors.password}
          rightSlot={
            <PasswordVisibilityButton isPasswordVisible={isPasswordVisible} onToggle={togglePasswordVisibility} />
          }
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-br from-[#ff8a3d] to-[#e04f00] text-[15px] font-semibold text-white shadow-[0_12px_28px_-10px_rgba(252,98,3,0.75)] transition-all hover:shadow-[0_16px_34px_-10px_rgba(252,98,3,0.95)] hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 lg:h-12"
      >
        {isSubmitting && <LoaderCircle className="size-[18px] animate-spin" strokeWidth={2} />}
        {isSubmitting && 'Signing in…'}

        {!isSubmitting && 'Sign in'}
        {!isSubmitting && (
          <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        )}
      </button>
    </form>
  )
}
