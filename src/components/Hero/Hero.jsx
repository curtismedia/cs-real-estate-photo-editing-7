import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand, cta } from '../../data/siteData'
import { heroSlides, HERO_SLIDE_DURATION } from '../../data/media'
import './Hero.css'

export default function Hero() {
  const [index, setIndex] = useState(0)
  const count = heroSlides.length

  useEffect(() => {
    if (count < 2) return
    // Respect users who have asked for reduced motion — hold the first frame.
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const id = setInterval(() => setIndex((i) => (i + 1) % count), HERO_SLIDE_DURATION)
    return () => clearInterval(id)
  }, [count])

  return (
    <section className="hero">
      <div className="hero__media">
        {heroSlides.map((slide, i) => (
          <img
            key={slide.src}
            className={`hero__slide ${i === index ? 'is-active' : ''}`}
            src={slide.src}
            alt={i === 0 ? slide.alt : ''}
            aria-hidden={i === 0 ? undefined : 'true'}
            // First frame is the LCP element; the rest load lazily behind it.
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchpriority={i === 0 ? 'high' : 'low'}
            decoding="async"
            draggable="false"
          />
        ))}
        <div className="hero__overlay" />
      </div>

      <div className="container hero__content">
        <span className="label hero__eyebrow">{brand.tagline}</span>
        <h1 className="display hero__title">
          Real estate imagery,<br />refined.
        </h1>
        <p className="hero__sub">
          Premium post-production for photographers and media teams — HDR, flambient,
          virtual staging, twilight and cinematic video, edited property by property.
        </p>
        <div className="hero__actions">
          <Link to={cta.primary.to} className="btn btn--light">
            {cta.primary.label}
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <Link to={cta.work.to} className="link hero__work-link">
            {cta.work.label}
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}
