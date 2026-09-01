import { PROMO } from '../../data/pricing'
import { useSaleCountdown } from '../../hooks/useSaleCountdown'
import './SaleBanner.css'

/**
 * Site-wide promotion bar. Sits ABOVE the header — it is not an overlay, and
 * the header/page offsets are pushed down by --banner-h in variables.css.
 *
 * One shared component, one shared clock. Every page that renders this gets
 * the same countdown because the deadline is computed from the timezone, not
 * from when the visitor arrived.
 */
export default function SaleBanner() {
  const { text, ready } = useSaleCountdown(PROMO.timezone)

  if (!PROMO.active) return null

  return (
    <div className="sale-banner" role="region" aria-label="Current promotion">
      <div className="sale-banner__inner">
        <span className="sale-banner__headline">{PROMO.headline}</span>
        <span className="sale-banner__sep" aria-hidden="true">
          ·
        </span>
        <span className="sale-banner__timer">
          {/* Reserve the space before the first tick so nothing jumps. */}
          <time className="sale-banner__clock" dateTime={ready ? undefined : undefined}>
            {ready ? text : '--:--:--'}
          </time>{' '}
          LEFT
        </span>
      </div>
    </div>
  )
}
