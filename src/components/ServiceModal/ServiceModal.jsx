import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../Modal/Modal'
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider'
import VideoModal from '../VideoModal/VideoModal'
import { cta } from '../../data/siteData'
import './ServiceModal.css'

export default function ServiceModal({ service, onClose }) {
  const [activeVideo, setActiveVideo] = useState(null)
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
            <div className="service-modal__videos">
              {service.videos.map((v) => (
                <button key={v.id} className="service-modal__video" onClick={() => setActiveVideo(v)}>
                  <img src={v.poster} alt={v.title} loading="lazy" />
                  <span className="service-modal__play" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
                  </span>
                  <span className="service-modal__video-title label">{v.title}</span>
                </button>
              ))}
            </div>
          )}

          <div className="service-modal__cta">
            <Link to={cta.primary.to} className="btn btn--light" onClick={onClose}>
              {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Modal>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  )
}
