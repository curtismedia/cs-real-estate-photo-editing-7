import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../../hooks/useSEO'
import BeforeAfterSlider from '../../components/BeforeAfterSlider/BeforeAfterSlider'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import ServiceModal from '../../components/ServiceModal/ServiceModal'
import ProjectModal from '../../components/ProjectModal/ProjectModal'
import { cta, contact, brand } from '../../data/siteData'
import { projects } from '../../data/projects'
import { orderedServices } from '../../data/services'
import { withBase } from '../../lib/assetPath'
import './About.css'

// ---------------------------------------------------------------------------
// Every image below is a REAL delivered edit already uploaded to this repo
// (see /public/images/work and /public/images/services) — no stock imagery,
// no invented clients, stats or testimonials.
//
// SERVICES NOTE: this page shows the 9 services that actually exist in
// src/data/services.js (the same catalogue used on /services and the
// homepage). "Floor Plans" and "3D / Virtual Tours" are not part of the real
// catalogue (Floor Plans was retired; 3D/Virtual Tours was never built), so
// they are not shown here — Object Removal is the studio's real 9th service.
// ---------------------------------------------------------------------------
const img = (p) => withBase(p)

const HERO_IMG = img('/images/work/project-02/project-02-74.jpg')
const FINAL_CTA_IMG = img('/images/services/twilight/after-01.jpg')

const FEATURED_BA = {
  before: img('/images/services/day-to-dusk/before-01.jpg'),
  after: img('/images/services/day-to-dusk/after-01.jpg'),
  label: 'One capture, edited to the brief — day to dusk',
}

const styleExamples = [
  {
    before: img('/images/services/hdr/before-01.jpg'),
    after: img('/images/services/hdr/after-01.jpg'),
    name: 'Natural & balanced',
    text: 'Accurate color, open shadows, true window detail — the everyday standard for listing photography.',
  },
  {
    before: img('/images/services/twilight/before-01.jpg'),
    after: img('/images/services/twilight/after-01.jpg'),
    name: 'Warm & golden-hour',
    text: 'The same property, taken to a twilight mood — deep sky, warm glow, nothing overdone.',
  },
  {
    before: img('/images/services/virtual-staging/before-01.jpg'),
    after: img('/images/services/virtual-staging/after-01.jpg'),
    name: 'Styled & furnished',
    text: 'An empty room brought to life with furnishing matched to the space’s own light and perspective.',
  },
]

const process = [
  {
    n: '01',
    kicker: 'Send',
    title: 'Send your files & references',
    text: 'Upload your RAW files, references, instructions, and any specific requirements.',
  },
  {
    n: '02',
    kicker: 'Understand',
    title: 'We learn your style',
    text: 'We review your references and requirements before editing, so our team knows exactly what you’re looking for.',
  },
  {
    n: '03',
    kicker: 'Edit',
    title: 'We bring it together',
    text: 'Our editors work through the project with your preferred style, requirements, and delivery standards in mind.',
  },
  {
    n: '04',
    kicker: 'QC & Deliver',
    title: 'We check before delivery',
    text: 'Every project goes through a final quality check for consistency, details, and your specific requirements before delivery.',
  },
]

const workflow = [
  { icon: 'layers', title: 'Consistent', text: 'Your preferences and requirements are documented and followed across projects.' },
  { icon: 'workflow', title: 'Reliable', text: 'A clear workflow and quality control process from start to finish.' },
  { icon: 'bolt', title: 'Fast', text: 'Typical turnaround of 8–12 hours, depending on the project.' },
  { icon: 'calendar', title: 'Flexible', text: 'From individual properties to recurring weekly production volume.' },
]

// Thin, editorial line icons — same stroke weight as the Before/After
// slider's handle arrows already in this codebase (strokeWidth 1.4).
function Icon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
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

function ArrowIcon({ dir }) {
  const d = dir === 'prev' ? 'M14 4l-7 7 7 7' : 'M8 4l7 7-7 7'
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

/**
 * Shared logic for the two full-bleed horizontal carousels on this page
 * (services + work). Handles scroll-snap index tracking, arrow-click
 * scrolling, and desktop click-drag — the existing homepage carousels rely on
 * native touch/scroll-snap only, so the drag handlers here are new but follow
 * the same visual pattern (see Home.css `.home-services__*`).
 */
function useHCarousel(itemCount) {
  const scrollerRef = useRef(null)
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const drag = useRef({ down: false, startX: 0, startScroll: 0, dragged: false })
  const rafPending = useRef(false)

  const updateIndex = () => {
    const track = trackRef.current
    const scroller = scrollerRef.current
    if (!track || !scroller) return
    const scrollerLeft = scroller.getBoundingClientRect().left
    let closest = 0
    let closestDist = Infinity
    Array.from(track.children).forEach((child, i) => {
      const dist = Math.abs(child.getBoundingClientRect().left - scrollerLeft)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    setIndex(closest)
  }

  const onScroll = () => {
    if (rafPending.current) return
    rafPending.current = true
    requestAnimationFrame(() => {
      updateIndex()
      rafPending.current = false
    })
  }

  const scrollToIndex = (i) => {
    const track = trackRef.current
    const scroller = scrollerRef.current
    if (!track || !scroller) return
    const clamped = Math.max(0, Math.min(itemCount - 1, i))
    const child = track.children[clamped]
    if (!child) return
    const delta = child.getBoundingClientRect().left - scroller.getBoundingClientRect().left
    scroller.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') return
    const scroller = scrollerRef.current
    if (!scroller) return
    drag.current = { down: true, startX: e.clientX, startScroll: scroller.scrollLeft, dragged: false }
    scroller.classList.add('is-dragging')
  }
  const onPointerMove = (e) => {
    const st = drag.current
    if (!st.down) return
    const dx = e.clientX - st.startX
    if (Math.abs(dx) > 4) st.dragged = true
    scrollerRef.current.scrollLeft = st.startScroll - dx
  }
  const endDrag = () => {
    const st = drag.current
    if (!st.down) return
    st.down = false
    scrollerRef.current?.classList.remove('is-dragging')
    // Clear on the next tick so the card's own click handler can still see
    // "dragged" first and suppress an accidental popup-open after a drag.
    setTimeout(() => {
      st.dragged = false
    }, 0)
  }
  const wasDragged = () => drag.current.dragged

  return {
    scrollerRef,
    trackRef,
    index,
    onScroll,
    scrollToIndex,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerLeave: endDrag,
    wasDragged,
  }
}

export default function About() {
  useSEO({
    title: 'About Curtis Visuals - Real Estate Post-Production Studio',
    description:
      'Curtis Visuals is a real estate post-production studio specializing in photo editing, video and 3D services. We don’t replace your style — we learn it.',
  })

  const [activeService, setActiveService] = useState(null)
  const [activeProject, setActiveProject] = useState(null)

  const serviceSlides = orderedServices.length + 1 // + final CTA slide
  const workSlides = projects.length + 1 // + final CTA slide

  const services = useHCarousel(serviceSlides)
  const work = useHCarousel(workSlides)

  const openService = (service) => {
    if (services.wasDragged()) return
    setActiveService(service)
  }
  const openProject = (project) => {
    if (work.wasDragged()) return
    setActiveProject(project)
  }

  const projIndex = projects.findIndex((p) => p.id === activeProject?.id)
  const nextProject = () => setActiveProject(projects[(projIndex + 1) % projects.length])
  const prevProject = () => setActiveProject(projects[(projIndex - 1 + projects.length) % projects.length])

  const serviceNum = String(Math.min(services.index + 1, orderedServices.length)).padStart(2, '0')

  return (
    <>
      {/* 01 — About Curtis Visuals */}
      <section className="section about-hero">
        <div className="container about-hero__grid">
          <div className="about-hero__text">
            <span className="label">About Curtis Visuals</span>
            <h1 className="display about-hero__title">
              The visual production team behind your next great project.
            </h1>
            <p className="lead about-hero__lead">
              {brand.name} is a real estate post-production studio specializing in photo editing,
              video, and 3D services. We work with photographers, media companies, and real estate
              teams to transform raw captures into polished visual content — from carefully edited
              property photography to video and immersive 3D experiences.
            </p>
            <p className="muted about-hero__note">
              Whether you need a single property completed or ongoing production support, we bring
              the same attention to quality, consistency, and detail to every project.
            </p>
          </div>
          <figure className="about-hero__media">
            <img src={HERO_IMG} alt="Bright, naturally lit interior — edited by Curtis Visuals" loading="eager" fetchpriority="high" />
          </figure>
        </div>
      </section>

      {/* 02 — Your Style, Your Vision */}
      <section className="section section--alt">
        <div className="container">
          <div className="about-style__head">
            <span className="label">Your style, your vision</span>
            <h2 className="display about-style__title">We don’t replace your style. We learn it.</h2>
            <p className="lead about-style__copy">
              Every photographer, media company, and real estate team has a different way of
              presenting a property. That’s why we don’t believe in a one-style-fits-all
              approach.
            </p>
            <p className="muted about-style__copy">
              Share your previous edits, references, brand guidelines, or specific requirements
              with us, and we’ll build our workflow around them. From the way a property is
              photographed to the way the final gallery is presented, your vision stays at the
              center of the process.
            </p>
            <p className="about-style__highlight">
              Different clients. Different styles. One consistent standard of service.
            </p>
          </div>

          <div className="about-style-grid">
            {styleExamples.map((ex) => (
              <div className="about-style-example" key={ex.name}>
                <BeforeAfterSlider before={ex.before} after={ex.after} alt={ex.name} />
                <h3 className="h3 about-style-example__name">{ex.name}</h3>
                <p className="muted about-style-example__text">{ex.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Our Process */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">Our process</span>
              <h2 className="h2 about-section-title">Simple on your side. Detailed on ours.</h2>
            </div>
          </div>
          <p className="lead about-process__intro">
            From the moment you send your files to the moment we deliver the final project, every
            step is built around keeping your workflow simple.
          </p>

          <ol className="about-process">
            {process.map((step) => (
              <li className="about-process__step" key={step.n}>
                <span className="about-process__num label">{step.n} — {step.kicker}</span>
                <h3 className="h3 about-process__title">{step.title}</h3>
                <p className="muted">{step.text}</p>
              </li>
            ))}
          </ol>

          <p className="muted about-process__footer">
            Clear communication. Consistent workflow. Reliable delivery.
          </p>
        </div>
      </section>

      {/* 04 — Our Services */}
      <section className="section section--alt about-services">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">Our services</span>
              <h2 className="h2 about-section-title">Everything you need after the shoot.</h2>
            </div>
            <div className="about-carousel__controls">
              <span className="about-carousel__progress label">{serviceNum} / {String(orderedServices.length).padStart(2, '0')}</span>
              <button type="button" className="about-carousel__arrow" onClick={() => services.scrollToIndex(services.index - 1)} aria-label="Previous service">
                <ArrowIcon dir="prev" />
              </button>
              <button type="button" className="about-carousel__arrow" onClick={() => services.scrollToIndex(services.index + 1)} aria-label="Next service">
                <ArrowIcon dir="next" />
              </button>
            </div>
          </div>
          <p className="lead about-services__intro">
            From post-production to complete visual content, our services are designed to support
            your workflow from capture to final delivery.
          </p>
        </div>

        <div
          className="about-carousel__scroller"
          ref={services.scrollerRef}
          onScroll={services.onScroll}
          onPointerDown={services.onPointerDown}
          onPointerMove={services.onPointerMove}
          onPointerUp={services.onPointerUp}
          onPointerLeave={services.onPointerLeave}
        >
          <div className="about-carousel__track" ref={services.trackRef}>
            {orderedServices.map((s, i) => (
              <div className="about-carousel__item" key={s.id}>
                <ServiceCard service={s} index={i + 1} onOpen={openService} />
              </div>
            ))}
            <div className="about-carousel__item about-carousel__cta-slide">
              <span className="label">Looking for something specific?</span>
              <h3 className="h3">Explore our full range of real estate visual services and find the right solution for your workflow.</h3>
              <Link to={cta.services.to} className="link">
                View All Services <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — The Work */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">The work</span>
              <h2 className="h2 about-section-title">One project. A complete visual story.</h2>
            </div>
          </div>
          <p className="lead about-work__intro">
            From individual images to complete property campaigns, every project brings together
            multiple pieces of visual content. Explore a selection of work across photo, video and
            3D — and see how different projects come together from capture to final delivery.
          </p>

          <BeforeAfterSlider before={FEATURED_BA.before} after={FEATURED_BA.after} alt={FEATURED_BA.label} label={FEATURED_BA.label} />

          <div className="about-carousel__controls about-carousel__controls--work">
            <button type="button" className="about-carousel__arrow" onClick={() => work.scrollToIndex(work.index - 1)} aria-label="Previous project">
              <ArrowIcon dir="prev" />
            </button>
            <button type="button" className="about-carousel__arrow" onClick={() => work.scrollToIndex(work.index + 1)} aria-label="Next project">
              <ArrowIcon dir="next" />
            </button>
          </div>
        </div>

        <div
          className="about-carousel__scroller"
          ref={work.scrollerRef}
          onScroll={work.onScroll}
          onPointerDown={work.onPointerDown}
          onPointerMove={work.onPointerMove}
          onPointerUp={work.onPointerUp}
          onPointerLeave={work.onPointerLeave}
        >
          <div className="about-carousel__track about-carousel__track--work" ref={work.trackRef}>
            {projects.map((p) => (
              <div className="about-carousel__item about-carousel__item--work" key={p.id}>
                <ProjectCard project={p} onOpen={openProject} />
              </div>
            ))}
            <div className="about-carousel__item about-carousel__item--work about-carousel__cta-slide">
              <span className="label">See more of our work.</span>
              <h3 className="h3">Explore the full Curtis Visuals portfolio.</h3>
              <Link to={cta.work.to} className="link">
                View Full Portfolio <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Built For Your Workflow */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div className="section-head__title">
              <span className="label">Built for your workflow</span>
              <h2 className="h2 about-section-title">Good post-production should make your job easier.</h2>
            </div>
          </div>
          <p className="lead about-workflow__intro">
            Your editing partner shouldn’t add another layer of work to your workflow. We
            focus on making the process straightforward — from receiving your files to delivering
            the final project.
          </p>

          <div className="about-why-grid">
            {workflow.map((w) => (
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

      {/* 07 — Try Us First */}
      <section className="section about-offer">
        <div className="container about-offer__inner">
          <span className="label">Try us first</span>
          <p className="about-offer__eyebrow">Not sure we’re the right fit?</p>
          <h2 className="display about-offer__title">Send us 10 images. We’ll edit them for free.</h2>
          <p className="lead about-offer__copy">
            See how we work before committing to a project. Send us up to 10 images along with
            your references or editing instructions, and we’ll show you what we can do.
          </p>
          <Link to={cta.primary.to} className="btn btn--solid">
            Get 10 Free Test Images <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <span className="about-offer__note muted">No commitment. No subscription. Just a test.</span>
        </div>
      </section>

      {/* 08 — Final CTA */}
      <section className="about-final">
        <img className="about-final__media" src={FINAL_CTA_IMG} alt="Twilight exterior, edited by Curtis Visuals" loading="lazy" />
        <div className="about-final__scrim" aria-hidden="true" />
        <div className="container about-final__content">
          <span className="label about-final__eyebrow">Let’s work together</span>
          <h2 className="display about-final__title">Your next project starts here.</h2>
          <p className="about-final__copy">
            Tell us what you’re working on, send us your references, and we’ll take it
            from there.
          </p>
          <div className="about-final__actions">
            <Link to={cta.primary.to} className="btn btn--light">
              Start Your Free Test <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <a href={`mailto:${contact.email}`} className="link about-final__email">
              {contact.email}
            </a>
          </div>
        </div>
      </section>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNext={activeProject ? nextProject : undefined}
        onPrev={activeProject ? prevProject : undefined}
      />
    </>
  )
}
