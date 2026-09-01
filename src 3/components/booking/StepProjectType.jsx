import { useBooking } from '../../context/BookingContext'
import { TOTAL_FREE_TEST_CREDITS } from '../../data/freeTestConfig'
import { PROMO } from '../../data/pricing'
import { useSaleCountdown } from '../../hooks/useSaleCountdown'

const OPTIONS = [
  {
    key: 'free-test',
    name: `Free Test — Up to ${TOTAL_FREE_TEST_CREDITS} Free Edits`,
    desc: 'Try our editing quality before placing a paid order. Standard edits use 1 credit each, advanced edits 5 credits each, out of 10.',
  },
  {
    key: 'book',
    name: 'Paid Project',
    // Free Test is credit-based and never discounted, so the promo block only
    // ever appears on the paid option.
    promo: PROMO.active,
    desc: 'Submit a full paid editing project.',
  },
]

/**
 * Sale line on the Paid Project card.
 *
 * Reads the same `useSaleCountdown(PROMO.timezone)` hook the global banner
 * uses. There is no second deadline: both derive from the next midnight in
 * America/Chicago, so the two readouts always show the same remaining time.
 */
function SalePromo() {
  const { text, ready } = useSaleCountdown(PROMO.timezone)
  // "UP TO 15% OFF ALL SERVICES" → "15%"; the copy lives in PROMO only.
  const amount = PROMO.headline.replace('UP TO ', '').split(' OFF')[0]

  return (
    <span className="promo">
      <span className="promo__offer">
        Up to <strong className="promo__amount">{amount} OFF</strong>
      </span>
      <span className="promo__timer">
        {/* Placeholder keeps the row height stable before the first tick. */}
        <span className="promo__clock">{ready ? text : '--:--:--'}</span> left
      </span>
    </span>
  )
}

export default function StepProjectType() {
  const { order, setProjectType } = useBooking()

  return (
    <div>
      <div className="select-grid project-type-grid">
        {OPTIONS.map((opt) => {
          const selected = order.projectType === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              className={`select-card project-type-card ${selected ? 'is-selected' : ''}`}
              onClick={() => setProjectType(opt.key)}
              aria-pressed={selected}
            >
              <span className="select-card__check" aria-hidden="true">
                {selected && (
                  <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 5.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                )}
              </span>
              <span className="project-type-card__name">{opt.name}</span>
              {opt.promo && <SalePromo />}
              <span className="project-type-card__desc muted">{opt.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
