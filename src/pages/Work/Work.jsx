import { useState } from 'react'
import { useSEO } from '../../hooks/useSEO'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import ProjectModal from '../../components/ProjectModal/ProjectModal'
import CTA from '../../components/CTA/CTA'
import { projects } from '../../data/projects'
import './Work.css'

export default function Work() {
  useSEO({
    title: 'Real Estate Photo Editing Portfolio | CS',
    description:
      'Selected real estate post-production projects — HDR, flambient, virtual staging, twilight, day-to-dusk, drone and video editing.',
  })

  const [active, setActive] = useState(null)
  const index = projects.findIndex((p) => p.id === active?.id)
  const next = () => setActive(projects[(index + 1) % projects.length])
  const prev = () => setActive(projects[(index - 1 + projects.length) % projects.length])

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="label">Selected work</span>
          <h1 className="display page-intro__title">
            From raw captures<br />to listing-ready imagery.
          </h1>
          <p className="lead page-intro__lead">
            A selection of properties we have refined for photographers and media teams —
            each edited to its own light and character.
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="work-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={setActive} />
            ))}
          </div>
        </div>
      </section>

      <CTA />

      <ProjectModal project={active} onClose={() => setActive(null)} onNext={next} onPrev={prev} />
    </>
  )
}
