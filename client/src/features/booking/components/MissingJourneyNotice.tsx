import { Link } from 'react-router'

type MissingJourneyNoticeProps = {
  message: string
}

// Shown when a booking page is opened without a journey (e.g. a bookmarked link)
export function MissingJourneyNotice({ message }: MissingJourneyNoticeProps) {
  return (
    <div className="rounded-3xl bg-surface p-6 text-ink">
      <p className="text-sm">{message}</p>
      <Link
        to="/#quote"
        className="mt-4 inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:brightness-95"
      >
        Enter your journey
      </Link>
    </div>
  )
}
