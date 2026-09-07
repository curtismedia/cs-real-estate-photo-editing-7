import { Link } from 'react-router-dom'
import Modal from '../Modal/Modal'
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider'
import VideoTile from '../VideoTile/VideoTile'
import { cta } from '../../data/siteData'
import './ServiceModal.css'

export default function ServiceModal({ service, onClose }) {
  if (!service) return null

  return (
    <>
      <Modal open={!!service} onClose={onClose} label={service.name}>
        <div className="service-modal">
          <header className="service-modal__head">
            <span className="label">{service.tagline}</span>
            <h2 className="h1 service-modal__title">{service.name}</h2>
            <p className="lead service-modal__desc">{service.description}</p>
          </header>

          {service.type === 'photo' && service.beforeAfterExamples?.length > 0 && (
            <div className="service-modal__ba">
              {service.beforeAfterExamples.map((ex, i) => (
                <BeforeAfterSlider key={i} before={ex.before} after={ex.after} alt={ex.label} label={ex.label} />
              ))}
            </div>
          )}

          {service.type === 'video' && service.videos?.length > 0 && (
            <>
              <div className="service-modal__videos">
                {service.videos.map((v) => (
                  <VideoTile key={v.youtubeId} video={v} />
                ))}
              </div>
              <p className="service-modal__all">
                <Link className="link" to="/services/video-editing" onClick={onClose}>
                  View all video work <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </p>
            </>
          )}

          <div className="service-modal__cta">
            <Link to={cta.primary.to} className="btn btn--light" onClick={onClose}>
              {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Modal>

    </>
  )
}
