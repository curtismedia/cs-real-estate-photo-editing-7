import { Link } from 'react-router-dom'
import { brand, nav, cta, contact, socials } from '../../data/siteData'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  // The Contact page link already lives next to the actual contact details
  // below, so it's left out of the Explore list to avoid repeating it.
  const exploreLinks = nav.filter((item) => item.to !== '/contact')

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">CS</Link>
          <p className="footer__tagline serif">
            Real estate imagery,<br />refined.
          </p>
        </div>

        <div className="footer__col">
          <nav aria-label="Footer">
            <span className="label">Explore</span>
            {exploreLinks.map((item) => (
              <Link key={item.to} to={item.to} className="footer__link">{item.label}</Link>
            ))}
          </nav>
          <div className="footer__sub">
            <span className="label">Follow</span>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="footer__link">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <span className="label">Contact</span>
          <Link to="/contact" className="footer__link">Contact page</Link>
          <a href={`mailto:${contact.email}`} className="footer__link">{contact.email}</a>
          <a href={contact.phoneHref} className="footer__link">{contact.phone}</a>
          <a href={contact.whatsappHref} target="_blank" rel="noreferrer" className="footer__link">
            WhatsApp
          </a>
          <address className="footer__address">
            {contact.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <span className="footer__muted">{contact.hours}</span>

          <div className="footer__sub">
            <span className="label">Start a project</span>
            <Link to={cta.primary.to} className="footer__link">{cta.primary.label}</Link>
            <Link to={cta.secondary.to} className="footer__link">{cta.secondary.label}</Link>
          </div>
        </div>

        <div className="footer__cta">
          <Link to={cta.primary.to} className="btn btn--light">
            {cta.primary.label}
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="container footer__bottom">
        <span className="footer__muted">© {year} {brand.name}</span>
      </div>
    </footer>
  )
}
