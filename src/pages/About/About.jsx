import { Link } from 'react-router-dom'
import { useSEO } from '../../hooks/useSEO'
import CTA from '../../components/CTA/CTA'
import { cta } from '../../data/siteData'
import './About.css'

const aboutImg = 'https://picsum.photos/seed/cs-about/1200/1500'

export default function About() {
  useSEO({
    title: 'About CS Real Estate Photo Editing',
    description:
      'CS is a real estate post-production studio — human judgment, consistency and storytelling for photographers and media teams.',
  })

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="label">About CS</span>
          <h1 className="display page-intro__title">
            Light, space,<br />and story.
          </h1>
        </div>
      </section>

      <section className="section--tight">
        <div className="container about__grid">
          <div className="about__text">
            <p className="lead">
              CS is a real estate post-production studio. We partner with photographers,
              media companies and marketing teams to turn raw captures into imagery that
              sells a property — without losing what makes it real.
            </p>
            <p className="muted">
              We are not a bulk-processing factory. Every set is edited with attention to
              light, architecture and atmosphere, then checked for consistency across the
              full gallery. The result reads as one considered story, not a batch run
              through a preset.
            </p>
            <p className="muted">
              We work quickly and at volume, and we match your existing style when you have
              one. Send a reference and we will make your imagery feel unmistakably yours.
            </p>
          </div>
          <div className="about__image">
            <img src={aboutImg} alt="Interior photography" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container about__cols">
          <div>
            <span className="label">Who we work with</span>
            <p className="about__col-text">Real estate photographers, media companies, agencies, brokerages and property marketing teams.</p>
          </div>
          <div>
            <span className="label">How we work</span>
            <p className="about__col-text">Share a link, tell us the look, we edit and refine. Reference-matched, revision-friendly, delivered on a rolling schedule.</p>
          </div>
          <div>
            <span className="label">What we care about</span>
            <p className="about__col-text">Accurate light and color, architectural honesty, consistency across a set, and imagery that tells the home’s story.</p>
          </div>
        </div>
      </section>

      <section className="section about__cta-simple">
        <div className="container">
          <Link to={cta.primary.to} className="btn">
            {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <CTA showSecondary={false} />
    </>
  )
}
