import './ProjectCard.css'

export default function ProjectCard({ project, onOpen }) {
  return (
    <button className="project-card" onClick={() => onOpen(project)} aria-label={`Open ${project.title}`}>
      <div className="project-card__media">
        <img src={project.cover} alt={project.title} loading="lazy" />
        <span className="project-card__view">
          View <span className="arrow" aria-hidden="true">→</span>
        </span>
      </div>
      <div className="project-card__meta">
        <h3 className="h3 project-card__title">{project.title}</h3>
        <div className="project-card__sub">
          {project.location && <span className="muted">{project.location}</span>}
          {project.services?.length > 0 && (
            <span className="label project-card__services">{project.services.join(' · ')}</span>
          )}
        </div>
      </div>
    </button>
  )
}
