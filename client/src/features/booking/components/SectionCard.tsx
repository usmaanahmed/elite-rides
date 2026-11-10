import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

// A white card with a heading, used for each part of the booking details page
export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-3xl bg-surface p-5 text-ink sm:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}
