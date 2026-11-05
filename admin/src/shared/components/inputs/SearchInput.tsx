import { Search } from 'lucide-react'
import { useEffect, useRef } from 'react'

type SearchInputProps = {
  placeholder?: string
  // When true, pressing Ctrl+K (or Cmd+K on Mac) focuses the input
  enableShortcut?: boolean
  // Pass both to read what is typed (e.g. to filter a table). Leave out for a box that keeps its own text.
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function SearchInput({
  placeholder = 'Search…',
  enableShortcut = false,
  value,
  onChange,
  className = '',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!enableShortcut) return

    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'
      if (isShortcut) {
        // Stop the browser's own Ctrl+K action (it focuses the address bar)
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableShortcut])

  return (
    <label
      className={`flex h-10 items-center gap-2.5 rounded-xl border border-line bg-surface px-3 text-sm transition-all focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/10 ${className}`}
    >
      <Search className="size-4 shrink-0 text-muted" strokeWidth={2} />
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={onChange && ((event) => onChange(event.target.value))}
        className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
      />
      {enableShortcut && (
        <kbd className="hidden shrink-0 rounded-md border border-line bg-surface-muted px-1.5 py-0.5 font-sans text-[11px] font-medium text-muted lg:inline-block">
          Ctrl K
        </kbd>
      )}
    </label>
  )
}
