import { useBooking } from '../../context/BookingContext'
import { TOTAL_FREE_TEST_CREDITS } from '../../data/freeTestConfig'
import { PROMO } from '../../data/pricing'

const OPTIONS = [
  {
    key: 'free-test',
    name: `Free Test — Up to ${TOTAL_FREE_TEST_CREDITS} Free Edits`,
    desc: 'Try our editing quality before placing a paid order. Standard edits use 1 credit each, advanced edits 5 credits each, out of 10.',
  },
  {
    key: 'book',
    name: 'Paid Project',
    // Free Test is credit-based and never discounted, so the promo line only
    // ever appears on the paid option.
    promo: PROMO.active ? PROMO.stepOneBadge : null,
    desc: 'Submit a full paid editing project.',
  },
]

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
              {opt.promo && <span className="project-type-card__promo">{opt.promo}</span>}
              <span className="project-type-card__desc muted">{opt.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
