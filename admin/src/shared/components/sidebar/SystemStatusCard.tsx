type SystemStatusCardProps = {
  title: string
  subtitle: string
}

export function SystemStatusCard({ title, subtitle }: SystemStatusCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface-muted p-4">
      <div className="flex items-center gap-2">
        {/* Pulsing green dot: a solid dot with a fading ring animated behind it */}
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <p className="text-xs font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-1 pl-4 text-xs text-muted">{subtitle}</p>
    </div>
  )
}
