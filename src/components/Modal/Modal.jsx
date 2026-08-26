import { useCallback, useEffect, useRef } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import './Modal.css'

/**
 * Accessible full-screen modal shell.
 * Props: open, onClose, label (aria-label), children, onPrev, onNext.
 * Handles ESC, arrow-key nav (when handlers given), scroll lock and focus.
 */
export default function Modal({ open, onClose, label, children, onPrev, onNext }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const lastFocused = useRef(null)

  useBodyScrollLock(open)

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement
    document.addEventListener('keydown', handleKey)
    // move focus into the dialog
    const t = setTimeout(() => closeRef.current?.focus(), 0)
    return () => {
      document.removeEventListener('keydown', handleKey)
      clearTimeout(t)
      // restore focus
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus()
    }
  }, [open, handleKey])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={label}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog" ref={dialogRef}>
        <button
          ref={closeRef}
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <span aria-hidden="true">Close</span>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>

        {onPrev && (
          <button className="modal__nav modal__nav--prev" onClick={onPrev} aria-label="Previous">
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M14 4l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        )}
        {onNext && (
          <button className="modal__nav modal__nav--next" onClick={onNext} aria-label="Next">
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M8 4l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        )}

        <div className="modal__content">{children}</div>
      </div>
    </div>
  )
}
