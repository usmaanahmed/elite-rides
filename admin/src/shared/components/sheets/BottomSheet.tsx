import { X } from 'lucide-react'
import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'

type BottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

// How far (in pixels) the sheet must be dragged down before letting go closes it
const CLOSE_DRAG_DISTANCE = 110

export function BottomSheet({ isOpen, onClose, title, description, children }: BottomSheetProps) {
  // Where the finger started, and how far the sheet has been dragged down since
  const [dragStartY, setDragStartY] = useState<number | null>(null)
  const [dragDistance, setDragDistance] = useState(0)
  const isDragging = dragStartY !== null

  useEffect(() => {
    if (!isOpen) return

    // Stop the page behind the sheet from scrolling while the sheet is open
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  function handleDragStart(event: PointerEvent<HTMLDivElement>) {
    setDragStartY(event.clientY)
    // Keep receiving move events even if the finger slides off the handle
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleDragMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStartY === null) return
    // Only allow dragging downwards
    setDragDistance(Math.max(0, event.clientY - dragStartY))
  }

  function handleDragEnd() {
    if (dragStartY === null) return
    if (dragDistance > CLOSE_DRAG_DISTANCE) onClose()
    setDragStartY(null)
    setDragDistance(0)
  }

  // Closed: pushed fully below the screen. Open: follows the finger while dragging.
  const sheetTransform = isOpen ? `translateY(${dragDistance}px)` : 'translateY(100%)'

  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 z-50 lg:hidden ${isOpen ? '' : 'pointer-events-none'}`}
    >
      {/* Dimmed backdrop; tapping it closes the sheet */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ transform: sheetTransform }}
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] max-w-lg flex-col rounded-t-[28px] bg-canvas shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] ${isDragging ? '' : 'transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]'}`}
      >
        {/* Drag area: the grab handle plus the title row */}
        <div
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          className="shrink-0 cursor-grab touch-none select-none px-5 pb-3 pt-2.5 active:cursor-grabbing"
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-muted/30" />

          <div className="mt-4 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              // Stop the tap on the close button from starting a drag
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Close"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-muted ring-1 ring-line transition-transform active:scale-90"
            >
              <X className="size-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Scrollable content; the bottom padding keeps it clear of the iPhone home bar */}
        <div className="overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">
          {children}
        </div>
      </div>
    </div>
  )
}
