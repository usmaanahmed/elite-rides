import { LoginForm } from '../components/LoginForm'
import { LoginHero } from '../components/LoginHero'
import { LoginThemeToggle } from '../components/LoginThemeToggle'

// Login screen.
// Phones: photo banner on top, with a rounded "app sheet" holding the form below it.
// Laptops (lg and up): photo panel on the left, form on the right.
export function LoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-surface lg:flex-row lg:p-3">
      <LoginHero />
      <LoginThemeToggle />

      {/* -mt-8 pulls the sheet up over the photo on phones; on laptops it is a normal column */}
      <main className="relative z-10 -mt-8 flex flex-1 flex-col rounded-t-[32px] bg-surface px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_-16px_rgba(0,0,0,0.45)] lg:mt-0 lg:rounded-none lg:px-12 lg:py-8 lg:shadow-none">
        {/* Grab handle, like a bottom sheet in a phone app */}
        <div className="mx-auto h-1.5 w-10 shrink-0 rounded-full bg-line lg:hidden" />

        {/* Phones: form starts near the top of the sheet. Tablets and laptops: form is centred. */}
        <div className="flex flex-1 flex-col pt-7 md:justify-center md:pt-0">
          <div className="mx-auto w-full max-w-[400px] motion-safe:animate-page-in">
            <div className="mb-8">
              <h1 className="font-display text-[38px] font-semibold leading-none text-ink lg:text-[44px]">
                Welcome back
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                Sign in to manage bookings, fleet and pricing.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  )
}
