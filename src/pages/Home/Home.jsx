import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../../hooks/useSEO'
import Hero from '../../components/Hero/Hero'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import ProjectModal from '../../components/ProjectModal/ProjectModal'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import ServiceModal from '../../components/ServiceModal/ServiceModal'
import TrustedBy from '../../components/TrustedBy/TrustedBy'
import TestimonialCarousel from '../../components/TestimonialCarousel/TestimonialCarousel'
import FAQ from '../../components/FAQ/FAQ'
import CTA from '../../components/CTA/CTA'
import { featuredProjects } from '../../data/projects'
import { orderedServices } from '../../data/services'
import { approachImage } from '../../data/media'
import { cta } from '../../data/siteData'
import './Home.css'

export default function Home() {
  useSEO({
    title: 'CS Real Estate Photo Editing',
    description:
      'Premium real estate photo and video post-production — HDR, flambient, virtual staging, twilight, drone, floor plans and video, edited property by property.',
  })

  const [activeProject, setActiveProject] = useState(null)
  const [activeService, setActiveService] = useState(null)

  const projIndex = featuredProjects.findIndex((p) => p.id === activeProject?.id)
  const nextProject = () => setActiveProject(featuredProjects[(projIndex + 1) % featuredProjects.length])
  const prevProject = () =>
    setActiveProject(featuredProjects[(projIndex - 1 + featuredProjects.length) % featuredProjects.length])

  return (
    <>
      <Hero />

      {/* Selected Work */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">Selected work</span>
              <h2 className="h2">From raw captures to listing-ready imagery.</h2>
            </div>
            <Link to={cta.work.to} className="link">
              View all work <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Grid on desktop; horizontal swipe carousel with a peeking next card on mobile
            (see .home-work__track media queries in Home.css). */}
        <div className="home-work__scroller">
          <div className="home-work__track">
            {featuredProjects.map((p) => (
              <div className="home-work__item" key={p.id}>
                <ProjectCard project={p} onOpen={setActiveProject} />
              </div>
            ))}
            <Link to={cta.work.to} className="home-work__item home-work__cta">
              <span className="home-work__cta-label">View All Work</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services preview — horizontal scroll */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">Services</span>
              <h2 className="h2">Post-production built around the property.</h2>
            </div>
            <Link to={cta.services.to} className="link">
              Explore our services <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="home-services__scroller">
          <div className="home-services__track">
            {orderedServices.map((s, i) => (
              <div className="home-services__item" key={s.id}>
                <ServiceCard service={s} index={i + 1} onOpen={setActiveService} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Approach — editorial image left, philosophy right */}
      <section className="section approach">
        <div className="container approach__grid">
          <figure className="approach__media">
            <img src={approachImage.src} alt={approachImage.alt} loading="lazy" decoding="async" />
          </figure>

          <div className="approach__body">
            <span className="label">The approach</span>
            <h2 className="display approach__title">We don’t edit homes by formula.</h2>
            <p className="lead">
              Every property has its own architecture, light, materials and mood. Presets
              flatten that. We edit each home to reveal what makes it distinct.
            </p>
            <p className="muted">
              That means careful attention to light and window detail, accurate color and
              architecture, human judgment on every frame, and consistency across an entire
              set — so a gallery feels like one considered story, not a batch run through a filter.
            </p>
          </div>
        </div>
      </section>

      <TrustedBy />

      {/* What They Say */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">What they say</span>
              <h2 className="h2">Trusted by photographers and media teams.</h2>
            </div>
          </div>
        </div>
        <TestimonialCarousel />
      </section>

      <FAQ />

      <CTA />

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNext={nextProject}
        onPrev={prevProject}
      />
      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  )
}
