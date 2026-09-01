import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand, nav, cta } from '../../data/siteData'
import { useScrolled } from '../../hooks/useScrolled'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import BrandMark from './BrandMark'
import './Header.css'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const scrolled = useScrolled(60)
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  // Locks body scroll while open; the hook's cleanup restores it on close,
  // on unmount and on route change alike, so body can never get stuck hidden.
  useBodyScrollLock(menuOpen)

  // Close on route change (also releases the scroll lock).
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // ESC closes menu
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const overHero = isHome && !scrolled && !menuOpen

  return (
    <>
      <header className={`site-header ${overHero ? 'site-header--over' : 'site-header--solid'}`}>
        <div className="site-header__inner container">
          <Link to="/" className="logo" aria-label={`${brand.name} — home`}>
            <BrandMark />
            <span className="logo__word">Real Estate Editing</span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link to={cta.primary.to} className="btn site-header__cta">
              <span className="site-header__cta-full">{cta.primary.label}</span>
              <span className="site-header__cta-short">{cta.primary.shortLabel}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>

            <button
              className="menu-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/*
        Mobile navigation — a top drawer (~66vh) plus a dimmed backdrop over
        the rest of the page.

        Rendered as a SIBLING of <header>, not inside it: .site-header--solid
        uses backdrop-filter, which makes the header the containing block for
        any position:fixed descendant. Nested, the drawer's `inset` resolved
        against the 84px header strip instead of the viewport — that was the
        root cause of the old see-through menu.
      */}
      <div
        className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop: tapping anywhere outside the drawer closes the menu. */}
        <button
          type="button"
          className="mobile-nav__backdrop"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
        />

        {/*
          The drawer stops click bubbling so taps inside it never reach the
          backdrop handler above.
        */}
        <div
          id="mobile-menu"
          className="mobile-nav__drawer"
          onClick={(e) => e.stopPropagation()}
          {...(menuOpen ? { role: 'dialog', 'aria-modal': true, 'aria-label': 'Menu' } : {})}
        >
          <div className="mobile-nav__bar container">
            <Link to="/" className="logo mobile-nav__logo" onClick={closeMenu}>
              <BrandMark />
            </Link>
            <button
              type="button"
              className="mobile-nav__close"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              Exit
            </button>
          </div>

          <nav className="mobile-nav__links container" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="mobile-nav__link"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
