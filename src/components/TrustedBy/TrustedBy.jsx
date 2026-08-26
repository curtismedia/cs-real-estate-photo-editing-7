import { clients } from '../../data/clients'
import './TrustedBy.css'

export default function TrustedBy() {
  // Duplicate for a seamless CSS marquee loop
  const row = [...clients, ...clients]
  return (
    <section className="trusted section--tight" aria-label="Trusted by">
      <div className="container">
        <span className="label trusted__label">Trusted by</span>
      </div>
      <div className="trusted__marquee">
        <div className="trusted__track">
          {row.map((c, i) => (
            <span className="trusted__item" key={`${c.name}-${i}`} aria-hidden={i >= clients.length}>
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
