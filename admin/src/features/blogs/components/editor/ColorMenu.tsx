import { Ban, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type ColorMenuProps = {
  icon: LucideIcon
  // e.g. "Text colour"
  label: string
  colors: string[]
  // The colour at the cursor ('' = none)
  currentColor: string
  onPick: (color: string) => void
  onClear: () => void
}

// A toolbar button that opens a small panel of colour swatches,
// plus a "custom colour" picker and a button to remove the colour
export function ColorMenu({ icon: Icon, label, colors, currentColor, onPick, onClear }: ColorMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the panel when the admin clicks anywhere outside it
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function pickColor(color: string) {
    onPick(color)
    setIsOpen(false)
  }

  function clearColor() {
    onClear()
    setIsOpen(false)
  }

  // The browser's colour picker only understands "#rrggbb", so use black for anything else
  let pickerValue = '#000000'
  if (/^#[0-9a-f]{6}$/i.test(currentColor)) {
    pickerValue = currentColor
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={(event) => event.preventDefault()}
        aria-label={label}
        aria-expanded={isOpen}
        title={label}
        className={`flex h-8 w-9 flex-col items-center justify-center gap-0.5 rounded-lg transition-colors hover:bg-nav-hover ${isOpen ? 'bg-nav-hover text-ink' : 'text-muted hover:text-ink'}`}
      >
        <Icon className="size-4" strokeWidth={2} />
        {/* A small bar under the icon shows the current colour */}
        <span
          className="h-0.75 w-4 rounded-full border border-line"
          style={{ backgroundColor: currentColor || 'transparent' }}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-1.5 w-56 rounded-xl border border-line bg-surface p-3 shadow-lg">
          <p className="mb-2 text-xs font-semibold text-muted">{label}</p>

          <div className="grid grid-cols-6 gap-1.5">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => pickColor(color)}
                onMouseDown={(event) => event.preventDefault()}
                aria-label={`Use colour ${color}`}
                title={color}
                className={`size-7 rounded-md border transition-transform hover:scale-110 ${currentColor.toLowerCase() === color ? 'border-ink ring-2 ring-accent/40' : 'border-line'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-ink hover:bg-nav-hover">
              {/* The browser's own colour picker, for any colour not in the list */}
              <input
                type="color"
                value={pickerValue}
                onChange={(event) => onPick(event.target.value)}
                className="size-5 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              Custom
            </label>
            <button
              type="button"
              onClick={clearColor}
              onMouseDown={(event) => event.preventDefault()}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted hover:bg-nav-hover hover:text-ink"
            >
              <Ban className="size-3.5" strokeWidth={2} />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
