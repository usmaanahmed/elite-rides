import type { ReactNode } from 'react'
import { Card } from '../../../shared/components/cards/Card'

type SettingsSectionProps = {
  title: string
  description: string
  children: ReactNode
}

// A card with a heading, used to group related settings (Office, Pricing, Extras...)
export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Card className="sm:p-6">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-0.5 text-sm text-muted">{description}</p>
      <div className="mt-5 space-y-5">{children}</div>
    </Card>
  )
}
