import { useEffect } from 'react'

/**
 * Locks body scroll while `locked` is true (modals, mobile menu).
 * Preserves scrollbar width to avoid layout shift.
 */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return

    const { body } = document
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight

    body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
    }
  }, [locked])
}
