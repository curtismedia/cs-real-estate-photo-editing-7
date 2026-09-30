import { Link } from 'react-router-dom'
import { useSEO } from '../../hooks/useSEO'
import BeforeAfterSlider from '../../components/BeforeAfterSlider/BeforeAfterSlider'
import { cta, contact, brand } from '../../data/siteData'
import { projects } from '../../data/projects'
import { withBase } from '../../lib/assetPath'
import './About.css'

// ---------------------------------------------------------------------------
// Every image below is a REAL delivered edit already uploaded to this repo
// (see /public/images/work and /public/images/services) — no stock imagery.
// ---------------------------------------------------------------------------
const img = (p) => withBase(p)

const HERO_IMG = img('/images/work/project-01/project-01-03.jpg')
const WHO_WE_ARE_IMG = img('/images/work/project-04/project-04-01.jpg')
const YOUR_STYLE_IMG = img('/images/work/project-06/project-06-68.jpg')
const FINAL_CTA_IMG = img('/images/services/twilight/after-01.jpg')

const philosophy = [
  { icon: 'sun', title: 'Natural light', text: 'Balanced exposure without artificial-looking brightness.' },
  { icon: 'palette', title: 'Accurate colors', text: 'Clean, realistic color without oversaturation.' },
  { icon: 'lines', title: 'Clean lines', text: 'Straight architecture and carefully corrected perspectives.' },
  { icon: 'window', title: 'Realistic windows & skies', text: 'Natural-looking views, skies and window pulls.' },
  { icon: 'layers', title: 'Gallery consistency', text: 'Every image works together as one complete story.' },
]

const process = [
  { n: '01', title: 'Reference', text: 'We review your references, preferences and editing requirements.' },
  { n: '02', title: 'Edit', text: 'Every image is edited to match your established style.' },
  { n: '03', title: 'Quality Control', text: 'Our team reviews the gallery for exposure, color, lines and consistency.' },
  { n: '04', title: 'Delivery', text: 'Fast turnaround without compromising the details.' },
]

// Six of the studio's real, currently-active services (Floor Plans has been
// retired from the catalogue, so it is not shown here — see src/data/services.js).
const editServices = [
  { image: img('/images/services/hdr/after-04.jpg'), name: 'HDR Editing', text: 'Balanced exposure, natural light and detail.' },
  { image: img('/images/services/flambient/after-01.jpg'), name: 'Flambient Editing', text: 'Hand-blended flash and ambient light for true-to-life rooms.' },
  { image: img('/images/services/twilight/after-01.jpg'), name: 'Twilight / Day-to-Dusk', text: 'Atmospheric skies and realistic lighting.' },
  { image: img('/images/services/virtual-staging/after-01.jpg'), name: 'Virtual Staging', text: 'Clean, realistic furnishing tailored to the space.' },
  { image: img('/images/services/drone-aerial/after-01.jpg'), name: 'Drone / Aerial', text: 'Polished aerial imagery with natural color and detail.' },
  { image: img('/images/services/single/after-01.jpg'), name: 'Single Image Editing', text: 'Detail-focused editing for individual images.' },
]

const why = [
  { icon: 'bolt', title: 'Fast turnaround', text: '8–12h standard turnaround.' },
  { icon: 'layers', title: 'Consistent editing', text: 'Your gallery looks like one complete set.' },
  { icon: 'workflow', title: 'Dedicated workflow', text: 'Your preferences are documented and followed.' },
  { icon: 'calendar', title: 'Flexible volume', text: 'From individual shoots to recurring weekly work.' },
]

// Thin, editorial line icons — same stroke weight as the Before/After
// slider's handle arrows already in this codebase (strokeWidth 1.4).
function Icon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
        </svg>
      )
    case 'palette':
      return (
        <svg {...common}>
          <path d="M12 3a9 8 0 1 0 0 16c1.2 0 2-.9 2-2 0-.6-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-.9.7-1.6 1.6-1.6H16a4 4 0 0 0 4-4c0-3.3-3.6-6-8-6Z" />
          <circle cx="7.5" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="7" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="14" cy="7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'lines':
      return (
        <svg {...common}>
          <path d="M4 20 20 4" />
          <path d="M14 4h6v6M4 14v6h6" />
        </svg>
      )
    case 'window':
      return (
        <svg {...common}>
          <rect x="4" y="3.5" width="16" height="17" rx="0.5" />
          <path d="M4 12h16M12 3.5v17" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...common}>
          <path d="M12 3l8.5 4.5L12 12 3.5 7.5 12 3Z" />
          <path d="M3.5 12 12 16.5 20.5 12" />
          <path d="M3.5 16.5 12 21l8.5-4.5" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M12.5 2.5 5 14h5.5L11 21.5 19 10h-5.5L12.5 2.5Z" />
        </svg>
      )
    case 'workflow':
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1" />
          <path d="M8.5 8.5h7M8.5 12.5h7M8.5 16.5h4" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="1" />
          <path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" />
        </svg>
      )
    default:
      return null
  }
}

export default function About() {
  useSEO({
    title: 'About Curtis Visuals - Real Estate Post-Production Studio',
    description:
      'CS is a real estate post-production studio — natural editing, consistent results, and your own style, refined. Enhance, don’t over-edit.',
  })

  const proofGrid = projects.slice(0, 4)

  return (
    <>
      {/* 01 — Hero */}
      <section className="section about-hero">
        <div className="container about-hero__grid">
          <div className="about-hero__text">
            <span className="label">About</span>
            <h1 className="display about-hero__title">
              Editing that makes real estate look its best — without making it look fake.
            </h1>
            <p className="lead about-hero__lead">
              {brand.name} is a real estate post-production studio built for photographers, media
              companies, and real estate teams. We transform raw captures into polished,
              natural-looking imagery that helps properties stand out — while keeping them true to
              the space.
            </p>
          </div>
          <figure className="about-hero__media">
            <img src={HERO_IMG} alt="Bright, naturally lit living room edited by CS" loading="eager" fetchpriority="high" />
          </figure>
        </div>
      </section>

      {/* 02 — Who We Are */}
      <section className="section section--alt">
        <div className="container about-split about-split--reverse">
          <figure className="about-split__media">
            <img src={WHO_WE_ARE_IMG} alt="Naturally lit interior lounge, edited by CS" loading="lazy" />
          </figure>
          <div className="about-split__text">
            <span className="label">Who we are</span>
            <h2 className="h2">
              A real estate post-production studio for photographers, media companies and real
              estate teams.
            </h2>
            <p className="muted">
              We handle the editing behind the scenes, so you can focus on shooting, selling, and
              growing your business. We work quickly, at volume, and can match your existing style
              when you have one.
            </p>
          </div>
        </div>
      </section>

      {/* 03 — Our Philosophy */}
      <section className="section">
        <div className="container">
          <div className="about-philosophy__head">
            <div className="about-philosophy__heading">
              <span className="label">Our philosophy</span>
              <h2 className="display about-philosophy__title">Enhance, don&rsquo;t over&#8209;edit.</h2>
            </div>
            <p className="lead about-philosophy__copy">
              We believe great editing should enhance a property, not change it. We focus on
              natural light, accurate colors, clean lines, realistic windows and skies, and a
              consistent look across the entire gallery.
            </p>
          </div>

          <div className="about-principles">
            {philosophy.map((p) => (
              <div className="about-principle" key={p.title}>
                <span className="about-principle__icon" aria-hidden="true">
                  <Icon name={p.icon} />
                </span>
                <h3 className="h3 about-principle__title">{p.title}</h3>
                <p className="muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — How We Work */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">How we work</span>
              <h2 className="h2">A simple, reliable process.</h2>
            </div>
          </div>

          <ol className="about-process">
            {process.map((step, i) => (
              <li className="about-process__step" key={step.n}>
                <span className="about-process__num label">{step.n}</span>
                <h3 className="h3 about-process__title">{step.title}</h3>
                <p className="muted">{step.text}</p>
                {i < process.length - 1 && (
                  <span className="about-process__arrow" aria-hidden="true">→</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 — What We Edit */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">What we edit</span>
              <h2 className="h2">A full range of real estate editing services.</h2>
            </div>
            <Link to={cta.services.to} className="link">
              {cta.services.label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="about-edit-grid">
            {editServices.map((s) => (
              <Link to={cta.services.to} className="about-edit-card" key={s.name}>
                <div className="about-edit-card__media">
                  <img src={s.image} alt={s.name} loading="lazy" />
                </div>
                <h3 className="h3 about-edit-card__name">{s.name}</h3>
                <p className="muted about-edit-card__text">{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Your Style */}
      <section className="section section--alt">
        <div className="container about-split">
          <figure className="about-split__media">
            <img src={YOUR_STYLE_IMG} alt="Living room finished to match the photographer's established look" loading="lazy" />
          </figure>
          <div className="about-split__text">
            <span className="label">Your style</span>
            <h2 className="display">Your style. Not ours.</h2>
            <p className="lead">
              Already have an established editing style? Send us a reference. We&rsquo;ll study your
              look and keep it consistent across every property — so the final gallery feels
              unmistakably yours.
            </p>
            <div className="about-swatches" role="img" aria-label="Neutral, warm tonal palette">
              <span className="about-swatch about-swatch--ivory" />
              <span className="about-swatch about-swatch--paper" />
              <span className="about-swatch about-swatch--stone" />
              <span className="about-swatch about-swatch--charcoal" />
            </div>
          </div>
        </div>
      </section>

      {/* 07 — Portfolio / Proof */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">See the difference</span>
              <h2 className="h2">Editing should be noticed for the right reasons.</h2>
            </div>
          </div>

          <BeforeAfterSlider
            before={img('/images/services/hdr/before-01.jpg')}
            after={img('/images/services/hdr/after-01.jpg')}
            alt="Living room before and after HDR editing"
            label="HDR editing — same room, natural balance"
          />

          <div className="about-proof-grid">
            {proofGrid.map((p) => (
              <Link to={cta.work.to} className="about-proof-grid__item" key={p.id}>
                <img src={p.cover} alt={p.title} loading="lazy" />
              </Link>
            ))}
          </div>

          <div className="about-proof-cta">
            <Link to={cta.work.to} className="link">
              View Full Portfolio <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 08 — Why CS */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">Why {brand.short}</span>
              <h2 className="h2">Built for your workflow.</h2>
            </div>
          </div>

          <div className="about-why-grid">
            {why.map((w) => (
              <div className="about-why-item" key={w.title}>
                <span className="about-why-item__icon" aria-hidden="true">
                  <Icon name={w.icon} />
                </span>
                <div>
                  <h3 className="h3">{w.title}</h3>
                  <p className="muted">{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — Free Test Offer */}
      <section className="section about-offer">
        <div className="container about-offer__inner">
          <span className="label">Not sure we&rsquo;re the right fit?</span>
          <h2 className="display about-offer__title">Try us with 10 free test images.</h2>
          <p className="lead about-offer__copy">
            Send us up to 10 images and your editing references. We&rsquo;ll show you what we can do
            before you commit to a project.
          </p>
          <Link to={cta.primary.to} className="btn btn--solid">
            {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <span className="about-offer__note muted">No commitment required.</span>
        </div>
      </section>

      {/* 10 — Final CTA */}
      <section className="about-final">
        <img className="about-final__media" src={FINAL_CTA_IMG} alt="Twilight exterior, edited by CS" loading="lazy" />
        <div className="about-final__scrim" aria-hidden="true" />
        <div className="container about-final__content">
          <span className="label about-final__eyebrow">Let&rsquo;s work together</span>
          <h2 className="display about-final__title">Let&rsquo;s make your next gallery look its best.</h2>
          <p className="about-final__copy">
            Send us a few images and your editing references. We&rsquo;ll take it from there.
          </p>
          <div className="about-final__actions">
            <Link to={cta.primary.to} className="btn btn--light">
              {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <a href={`mailto:${contact.email}`} className="link about-final__email">
              {contact.email}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
