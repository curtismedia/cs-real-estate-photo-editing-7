import { useCallback, useRef, useState } from 'react'
import './BeforeAfterSlider.css'

/**
 * One reusable Before/After slider.
 * Props: before, after (image URLs), alt, label (optional caption).
 * Mouse drag, touch drag and keyboard (arrow keys on the handle).
 * Uses clip-path so the "before" image is never distorted.
 */
export default function BeforeAfterSlider({ before, after, alt = '', label }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const setFromClientX = useCallback((clientX) => {
    const el = containerRef.current
    if (!el || clientX == null) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, pct)))
  }, [])

  const onDown = (e) => {
    dragging.current = true
    setFromClientX(e.clientX ?? e.touches?.[0]?.clientX)
  }
  const onMove = (e) => {
    if (!dragging.current) return
    setFromClientX(e.clientX ?? e.touches?.[0]?.clientX)
  }
  const stop = () => (dragging.current = false)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4))
    if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4))
  }

  return (
    <figure className="ba">
      <div
        className="ba__stage"
        ref={containerRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={stop}
      >
        <img
          className="ba__img"
          src={after}
          alt={alt ? `${alt} — after` : 'After'}
          loading="lazy"
          draggable="false"
        />
        <img
          className="ba__img ba__img--before"
          src={before}
          alt={alt ? `${alt} — before` : 'Before'}
          loading="lazy"
          draggable="false"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        <span className="ba__tag ba__tag--before">Before</span>
        <span className="ba__tag ba__tag--after">After</span>

        <button
          className="ba__handle"
          style={{ left: `${pos}%` }}
          type="button"
          role="slider"
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
          onMouseDown={onDown}
          onTouchStart={onDown}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <path d="M11 7l-4 6 4 6M15 7l4 6-4 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
      {label && <figcaption className="ba__caption label">{label}</figcaption>}
    </figure>
  )
}
