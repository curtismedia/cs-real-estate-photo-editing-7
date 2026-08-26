import { useEffect, useRef } from 'react'
import { testimonials } from '../../data/testimonials'
import './TestimonialCarousel.css'

/** How long to hold off autoplay after the customer stops interacting. */
const RESUME_DELAY_MS = 1400

export default function TestimonialCarousel() {
  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const offset = useRef(0)
  const half = useRef(0)
  const dragging = useRef(false)
  const dragged = useRef(false) // true once a drag has moved past a small threshold
  const hovering = useRef(false)
  const pausedUntil = useRef(0)
  const startX = useRef(0)
  const startOffset = useRef(0)

  // Duplicate the list once so the loop can wrap seamlessly. The duplicate is
  // marked aria-hidden so screen readers only announce each review once.
  const items = [...testimonials, ...testimonials]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const speed = reduce ? 0 : 28 // px per second — a comfortable reading pace
    let last = performance.now()
    let raf

    const measure = () => { half.current = track.scrollWidth / 2 }
    measure()
    window.addEventListener('resize', measure)

    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      const paused = dragging.current || hovering.current || now < pausedUntil.current
      if (!paused) offset.current -= speed * dt

      const h = half.current
      if (h > 0) {
        if (offset.current <= -h) offset.current += h
        if (offset.current > 0) offset.current -= h
      }
      track.style.transform = `translate3d(${offset.current}px,0,0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const resumeSoon = () => { pausedUntil.current = performance.now() + RESUME_DELAY_MS }

  // Native (non-passive) wheel listener so trackpad horizontal scroll can
  // preventDefault() without React's passive-by-default warning/no-op.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      if (!horizontal) return // let vertical page scroll pass through untouched
      e.preventDefault()
      offset.current -= e.deltaX
      resumeSoon()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const getX = (e) => e.clientX ?? e.touches?.[0]?.clientX ?? 0
  const onDown = (e) => {
    dragging.current = true
    dragged.current = false
    startX.current = getX(e)
    startOffset.current = offset.current
  }
  const onMove = (e) => {
    if (!dragging.current) return
    const dx = getX(e) - startX.current
    if (Math.abs(dx) > 3) dragged.current = true
    offset.current = startOffset.current + dx
  }
  const onUp = () => {
    dragging.current = false
    resumeSoon()
  }

  return (
    <div className="testi">
      <div
        className="testi__viewport"
        ref={viewportRef}
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => { hovering.current = false; dragging.current = false; resumeSoon() }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <div className="testi__track" ref={trackRef}>
          {items.map((t, i) => {
            const isDuplicate = i >= testimonials.length
            return (
              <figure className="testi__card" key={`${t.id}-${i}`} aria-hidden={isDuplicate || undefined}>
                <blockquote className="testi__quote serif">“{t.quote}”</blockquote>
                <figcaption className="testi__by">
                  {t.photo && <img className="testi__avatar" src={t.photo} alt="" loading="lazy" />}
                  <span>
                    <span className="testi__name">{t.name}</span>
                    <span className="testi__role muted">{t.role}, {t.company}</span>
                  </span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </div>
  )
}
