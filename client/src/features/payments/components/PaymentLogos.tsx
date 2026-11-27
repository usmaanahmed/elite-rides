// Simple card logos drawn with plain SVG (no image files needed).
// Each logo is a small function so it is easy to change or replace with a real image later.

// Visa: blue italic text
function VisaLogo() {
  return (
    <svg viewBox="0 0 80 28" className="h-7 w-auto" role="img" aria-label="Visa">
      <text x="40" y="23" textAnchor="middle" fontSize="26" fontWeight="800" fontStyle="italic" fill="#1a1f71">
        VISA
      </text>
    </svg>
  )
}

// Mastercard: red and orange circles with the name below
function MastercardLogo() {
  return (
    <svg viewBox="0 0 80 40" className="h-9 w-auto" role="img" aria-label="Mastercard">
      <circle cx="31" cy="15" r="12" fill="#eb001b" />
      <circle cx="49" cy="15" r="12" fill="#f79e1b" />
      <path d="M40 5.5 a12 12 0 0 1 0 19 a12 12 0 0 1 0 -19z" fill="#ff5f00" />
      <text x="40" y="37" textAnchor="middle" fontSize="8" fill="#1f2937">
        mastercard
      </text>
    </svg>
  )
}

// Maestro: blue and red circles with the name on top
function MaestroLogo() {
  return (
    <svg viewBox="0 0 70 40" className="h-9 w-auto" role="img" aria-label="Maestro">
      <circle cx="26" cy="20" r="16" fill="#0099df" />
      <circle cx="44" cy="20" r="16" fill="#ed1c2e" />
      <path d="M35 7.2 a16 16 0 0 1 0 25.6 a16 16 0 0 1 0 -25.6z" fill="#6c6bbd" />
      <text x="35" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fontStyle="italic" fill="#ffffff">
        Maestro
      </text>
    </svg>
  )
}

// American Express: blue bold text on two lines
function AmericanExpressLogo() {
  return (
    <svg viewBox="0 0 90 32" className="h-8 w-auto" role="img" aria-label="American Express">
      <text x="45" y="14" textAnchor="middle" fontSize="13" fontWeight="800" fill="#016fd0">
        AMERICAN
      </text>
      <text x="45" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#016fd0">
        EXPRESS
      </text>
    </svg>
  )
}

// The row of accepted cards: each logo sits on a small white card so it is readable on the dark page
export function PaymentLogos() {
  const cardClasses = 'grid h-16 w-36 place-items-center rounded-2xl bg-white px-4 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.8)] sm:w-40'

  return (
    <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <li className={cardClasses}>
        <VisaLogo />
      </li>
      <li className={cardClasses}>
        <MastercardLogo />
      </li>
      <li className={cardClasses}>
        <MaestroLogo />
      </li>
      <li className={cardClasses}>
        <AmericanExpressLogo />
      </li>
    </ul>
  )
}
