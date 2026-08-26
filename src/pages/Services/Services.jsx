import { useState } from 'react'
import { useSEO } from '../../hooks/useSEO'
import BeforeAfterSlider from '../../components/BeforeAfterSlider/BeforeAfterSlider'
import ServiceModal from '../../components/ServiceModal/ServiceModal'
import CTA from '../../components/CTA/CTA'
import { orderedServices } from '../../data/services'
import './Services.css'

export default function Services() {
  useSEO({
    title: 'Real Estate Photo & Video Editing Services | CS',
    description:
      'Video editing, virtual staging, HDR editing, object removal, flambient editing, twilight, day-to-dusk, drone editing, single-image editing and floor plans for real estate media professionals.',
  })

  const [active, setActive] = useState(null)

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="label">Services</span>
          <h1 className="display page-intro__title">
            Post-production built<br />around the property.
          </h1>
          <p className="lead page-intro__lead">
            Ten specialist services for photographers and media teams — from everyday HDR
            and hand-blended flambient work to cinematic listing films.
          </p>
        </div>
      </section>

      <div className="services-list">
        {orderedServices.map((s, i) => {
          const firstBA = s.beforeAfterExamples?.[0]
          return (
            <section className={`service-row ${i % 2 ? 'service-row--flip' : ''}`} key={s.id}>
              <div className="container service-row__inner">
                <div className="service-row__media">
                  {s.type === 'photo' && firstBA ? (
                    <BeforeAfterSlider before={firstBA.before} after={firstBA.after} alt={s.name} />
                  ) : (
                    <button className="service-row__cover" onClick={() => setActive(s)} aria-label={`View ${s.name} examples`}>
                      <img src={s.cover} alt={s.name} loading="lazy" />
                      {s.type === 'video' && (
                        <span className="service-row__play" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <div className="service-row__text">
                  <span className="label service-row__num">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="h2 service-row__name">{s.name}</h2>
                  <p className="muted service-row__desc">{s.description}</p>
                  <button className="link" onClick={() => setActive(s)}>
                    View examples <span className="arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <CTA />

      <ServiceModal service={active} onClose={() => setActive(null)} />
    </>
  )
}
