import { useBooking } from '../../context/BookingContext'
import { TURNAROUND_TYPES, turnaroundOrder, isValidTurnaroundHours, formatAmount } from '../../data/pricing'

export default function StepTurnaround() {
  const { order, setTurnaroundType, setTurnaroundHours, estimate, rushFee } = useBooking()
  const { turnaround } = order
  const active = TURNAROUND_TYPES[turnaround.type]
  const hoursValid = isValidTurnaroundHours(turnaround.type, turnaround.hours)

  return (
    <div>
      <fieldset className="turnaround-options">
        <legend className="sr-only">Choose a turnaround time</legend>

        {turnaroundOrder.map((key) => {
          const t = TURNAROUND_TYPES[key]
          const selected = turnaround.type === key

          return (
            <div key={key} className={`turnaround-card ${selected ? 'is-selected' : ''}`}>
              <label className="turnaround-card__toggle">
                <input
                  type="radio"
                  name="turnaround-type"
                  value={key}
                  checked={selected}
                  onChange={() => setTurnaroundType(key)}
                />
                <span className="turnaround-card__body">
                  <span className="turnaround-card__name">{t.label.replace(' Turnaround', '').toUpperCase()}</span>
                  <span className="turnaround-card__range">{t.rangeLabel}</span>
                  <span className={`turnaround-card__fee ${t.feePercent === 0 ? 'is-free' : ''}`}>
                    {t.feePercent === 0 ? 'No additional fee' : `+${t.feePercent}%`}
                  </span>
                </span>
              </label>

              {selected && (
                <div className="turnaround-card__hours">
                  <label className="field__label" htmlFor={`hours-${key}`}>
                    How many hours would you like us to deliver the project in?
                  </label>
                  <div className="field-inline">
                    <input
                      id={`hours-${key}`}
                      className="field__input"
                      type="number"
                      inputMode="numeric"
                      min={t.exclusiveMin ? t.minHours + 0.5 : t.minHours}
                      max={t.exclusiveMax ? t.maxHours - 0.5 : t.maxHours}
                      step="1"
                      value={turnaround.hours}
                      onChange={(e) => setTurnaroundHours(Number(e.target.value))}
                    />
                    <span className="field__suffix">hours</span>
                  </div>
                  {!hoursValid && (
                    <p className="field__error">
                      Enter a value {t.exclusiveMin ? 'greater than' : 'of at least'} {t.minHours}
                      {' '}and {t.exclusiveMax ? 'under' : 'no more than'} {t.maxHours} hours.
                    </p>
                  )}
                  <p className="field__hint">{t.note}</p>
                </div>
              )}
            </div>
          )
        })}
      </fieldset>

      {estimate.hasLines && rushFee.hasFee && (
        <div className="payment-summary" style={{ marginTop: '2rem' }}>
          <div className="payment-summary__row">
            <span>Service subtotal</span>
            <span>{estimate.variable ? 'Estimated ' : ''}{formatAmount(estimate.min, estimate.max)}</span>
          </div>
          <div className="payment-summary__row payment-summary__row--strong">
            <span>{active.feeLabel}</span>
            <span>{rushFee.variable ? 'Estimated ' : ''}{rushFee.amountText}</span>
          </div>
        </div>
      )}

      <div className="upsell" style={{ marginTop: '2rem' }}>
        <p>
          Turnaround starts once the project is confirmed and the required files and payment have
          been received. Rush and extreme rush availability still depends on project scope and
          must be confirmed by our team before production begins.
        </p>
      </div>
    </div>
  )
}
