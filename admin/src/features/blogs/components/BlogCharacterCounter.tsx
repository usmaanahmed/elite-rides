type BlogCharacterCounterProps = {
  length: number
  maxLength: number
  // Optional softer limit, e.g. what Google shows. The counter turns orange after it.
  idealLength?: number
}

// The small "48 / 160" text next to a field's label
export function BlogCharacterCounter({ length, maxLength, idealLength }: BlogCharacterCounterProps) {
  let colorClass = 'text-muted'
  if (length > maxLength) {
    colorClass = 'text-danger'
  } else if (idealLength !== undefined && length > idealLength) {
    colorClass = 'text-accent-ink'
  }

  let limitShown = maxLength
  if (idealLength !== undefined) {
    limitShown = idealLength
  }

  return (
    <span className={`text-xs tabular-nums ${colorClass}`}>
      {length} / {limitShown}
    </span>
  )
}
