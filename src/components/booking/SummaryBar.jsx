import { useBooking } from '../../context/BookingContext'
import { formatAmount } from '../../data/pricing'
import { TOTAL_FREE_TEST_CREDITS } from '../../data/freeTestConfig'
import './booking.css'

export default function SummaryBar({ onBack, onNext, nextLabel = 'Continue', nextLabelShort, canBack, canNext = true }) {
  const { total, totals, freeTest, freeTestCredits } = useBooking()

  const label = freeTest
    ? 'Test capacity'
    : total.variable
      ? 'Estimated total'
      : 'Project total'

  // No fake dollar totals for a free test — show the real capacity instead.
  const amount = freeTest
    ? `${freeTestCredits.used} / ${TOTAL_FREE_TEST_CREDITS}`
    : formatAmount(total.min, total.max)

  return (
    <div className="summary-bar">
      <div className="container summary-bar__inner">
        <div className="summary-bar__total">
          <span className="label summary-bar__label">{label}</span>
          <span className="summary-bar__amount serif">{amount}</span>
          {!freeTest && totals.hasSavings && (
            <span className="summary-bar__saving">You save {totals.savingsText}</span>
          )}
        </div>
        <div className="summary-bar__actions">
          {canBack && (
            <button type="button" className="link summary-bar__back" onClick={onBack}>
              <span className="arrow" aria-hidden="true">←</span> Back
            </button>
          )}
          <button
            type="button"
            className="btn btn--solid summary-bar__next"
            onClick={onNext}
            disabled={!canNext}
          >
            <span className="summary-bar__next-label summary-bar__next-label--full">{nextLabel}</span>
            <span className="summary-bar__next-label summary-bar__next-label--short">
              {nextLabelShort || nextLabel}
            </span>
            <span className="arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
