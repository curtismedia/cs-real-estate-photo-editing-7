import { useState } from 'react'

/**
 * The "CS" half of the brand lockup.
 *
 * Both images are rendered and CSS picks one based on the header's own state
 * class (.site-header--over vs --solid). Doing the switch in CSS rather than
 * JS means the correct logo is painted on the very first frame — a JS check
 * would flash the white logo on solid-header pages before correcting itself.
 *
 * If the assets are missing the component falls back to the original "CS"
 * text, so the header degrades to exactly what it looked like before rather
 * than showing two broken-image icons.
 */
export const LOGO_LIGHT = '/images/brand/cs-logo-white.png'
export const LOGO_DARK = '/images/brand/cs-logo-black.png'

export default function BrandMark({ alt = 'CS' }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <span className="logo__mark">CS</span>

  return (
    <span className="logo__mark logo__mark--img">
      <img
        className="logo__img logo__img--dark"
        src={LOGO_DARK}
        alt={alt}
        onError={() => setFailed(true)}
      />
      <img
        className="logo__img logo__img--light"
        src={LOGO_LIGHT}
        alt=""
        aria-hidden="true"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
