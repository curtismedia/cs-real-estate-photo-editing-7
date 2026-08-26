import Modal from '../Modal/Modal'
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider'
import { cta } from '../../data/siteData'
import { Link } from 'react-router-dom'
import './ProjectModal.css'

export default function ProjectModal({ project, onClose, onPrev, onNext }) {
  if (!project) return null

  return (
    <Modal open={!!project} onClose={onClose} onPrev={onPrev} onNext={onNext} label={project.title}>
      <div className="project-modal">
        <header className="project-modal__head">
          <div>
            <span className="label">{project.location}</span>
            <h2 className="h1 project-modal__title">{project.title}</h2>
          </div>
          {project.services?.length > 0 && (
            <p className="label project-modal__services">{project.services.join(' · ')}</p>
          )}
        </header>

        {project.description && (
          <p className="lead project-modal__desc">{project.description}</p>
        )}

        {project.beforeAfter?.length > 0 && (
          <section className="project-modal__section">
            <span className="label">Before / After</span>
            <div className="project-modal__ba">
              {project.beforeAfter.map((pair, i) => (
                <BeforeAfterSlider
                  key={i}
                  before={pair.before}
                  after={pair.after}
                  alt={pair.label}
                  label={pair.label}
                />
              ))}
            </div>
          </section>
        )}

        {project.gallery?.length > 0 && (
          <section className="project-modal__section">
            <span className="label">Gallery</span>
            <div className="project-modal__gallery">
              {project.gallery.map((src, i) => (
                <img key={i} src={src} alt={`${project.title} ${i + 1}`} loading="lazy" />
              ))}
            </div>
          </section>
        )}

        <div className="project-modal__cta">
          <Link to={cta.primary.to} className="btn btn--light" onClick={onClose}>
            {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </Modal>
  )
}
