import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  // Buttons pinned to the bottom of the modal, e.g. "Cancel" and "Save"
  footer?: ReactNode
  // Set to false to stop a click on the dimmed backdrop from closing the modal,
  // e.g. while a form has unsaved changes that a stray click would throw away
  closeOnBackdropClick?: boolean
  // How wide the modal is on tablets and desktops (phones always use the full width)
  size?: ModalSize
}

type ModalSize = 'small' | 'large'

const sizeClasses = {
  small: 'sm:max-w-lg',
  large: 'sm:max-w-2xl',
}

// Centred dialog on tablets and desktops; slides up from the bottom like a sheet on phones.
// It stays in the page while closed (just hidden) so it can animate both in and out.
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnBackdropClick = true,
  size = 'large',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  // Unique id that ties the dialog to its title for screen readers
  const titleId = useId()

  // While open: move keyboard focus into the modal and stop the page behind it from scrolling.
  // When it closes, focus goes back to whatever was focused before (usually the button that opened it).
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement
    panelRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [isOpen])

  // Close on the Escape key. Kept in its own effect so a new `onClose` function
  // does not re-run the focus effect above and pull focus away from an input.
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const panelStateClasses = isOpen
    ? 'translate-y-0 opacity-100 sm:scale-100'
    : 'translate-y-full sm:translate-y-3 sm:scale-[0.98] sm:opacity-0'

  // createPortal renders the modal at the end of <body>, so it always sits above
  // the sidebar and bottom bar no matter where in the page it is used
  return createPortal(
    <div
      inert={!isOpen}
      className={`fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:p-6 ${isOpen ? '' : 'pointer-events-none'}`}
    >
      {/* Dimmed backdrop */}
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] outline-none transition-[translate,scale,opacity] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] sm:max-h-[90dvh] sm:rounded-3xl sm:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.35)] ${sizeClasses[size]} ${panelStateClasses}`}
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-muted text-muted ring-1 ring-line transition-colors hover:text-ink active:scale-90"
          >
            <X className="size-4" strokeWidth={2.25} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>

        {/* The extra bottom padding on phones keeps the buttons clear of the iPhone home bar */}
        {footer && (
          <div className="shrink-0 border-t border-line bg-surface-muted px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 sm:px-6 sm:pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
