import './ServiceCard.css'

export default function ServiceCard({ service, index, onOpen }) {
  const num = String(index ?? service.order).padStart(2, '0')
  return (
    <button className="service-card" onClick={() => onOpen(service)} aria-label={`View ${service.name} examples`}>
      <div className="service-card__media">
        <img src={service.cover} alt={service.name} loading="lazy" />
        {service.type === 'video' && (
          <span className="service-card__play" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
          </span>
        )}
      </div>
      <div className="service-card__meta">
        <span className="label service-card__num">{num}</span>
        <h3 className="h3 service-card__name">{service.name}</h3>
        <p className="muted service-card__tagline">{service.tagline}</p>
        <span className="link service-card__cta">
          View Examples <span className="arrow" aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  )
}
