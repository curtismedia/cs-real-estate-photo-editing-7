import { Link } from 'react-router-dom'
import { cta } from '../../data/siteData'
import './CTA.css'

/**
 * Reusable closing CTA band.
 * Props (all optional): eyebrow, title, text, showSecondary.
 */
export default function CTA({
  eyebrow = "Let's begin",
  title = 'Ready to see what your images can become?',
  text = 'Send us up to 10 images and we will edit them free — no commitment. See the difference on your own photos before you order.',
  showSecondary = true,
}) {
  return (
    <section className="cta-band section section--dark">
      <div className="container cta-band__inner">
        <span className="label">{eyebrow}</span>
        <h2 className="display cta-band__title">{title}</h2>
        <p className="cta-band__text muted">{text}</p>
        <div className="cta-band__actions">
          <Link to={cta.primary.to} className="btn btn--light">
            {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
          </Link>
          {showSecondary && (
            <Link to={cta.secondary.to} className="link cta-band__secondary">
              {cta.secondary.label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
