import { ArrowRight } from 'lucide-react'

type SubmitButtonProps = {
  label: string
  // true = greyed out and can't be pressed (e.g. while the price is still loading)
  disabled?: boolean
}

// Big orange (brand colour) button at the bottom of each booking form
export function SubmitButton({ label, disabled = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="group mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-[15px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(252,98,3,0.9)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
    >
      {label}
      <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
    </button>
  )
}
