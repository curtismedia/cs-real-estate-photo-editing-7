import { Link } from 'react-router-dom'
import { brand } from '../../data/siteData'

export default function WizardHeader() {
  return (
    <header className="site-header site-header--solid" style={{ position: 'fixed', top: 'var(--banner-h)' }}>
      <div className="site-header__inner container">
        <Link to="/" className="logo" aria-label={`${brand.name} — home`}>
          <span className="logo__mark">CS</span>
          <span className="logo__word">Real Estate Editing</span>
        </Link>
        <Link to="/" className="link" style={{ marginLeft: 'auto' }}>
          Exit
        </Link>
      </div>
    </header>
  )
}
