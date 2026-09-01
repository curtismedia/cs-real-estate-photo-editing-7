import { useBooking } from '../../context/BookingContext'
import { pricedServices, isDiscounted, unitLabel } from '../../data/pricing'
import DiscountBadge from './DiscountBadge'
import PartnerPricing from './PartnerPricing'
import {
  TOTAL_FREE_TEST_CREDITS,
  isFreeTestEligible,
  isFreeTestGroupB,
  creditCostFor,
  creditLabelFor,
} from '../../data/freeTestConfig'

function Stepper({ label, value, onChange, min = 0, max = Infinity, hint, id, disabledInc }) {
  const incDisabled = disabledInc ?? value >= max
  return (
    <div>
      {label && <label className="field__label" htmlFor={id}>{label}</label>}
      <div className="stepper">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label || 'quantity'}`}
        >
          −
        </button>
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label || 'Quantity'}
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={incDisabled}
          aria-label={`Increase ${label || 'quantity'}`}
        >
          +
        </button>
      </div>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}

export default function StepServices() {
  const {
    order, freeTest, estimate, toggleService, setQuantity,
    freeTestCredits, canAddImage, maxQtyFor,
  } = useBooking()


  // Free Test only ever offers the eligible services — excluded ones (video,
  // floor plan, virtual staging) are hidden entirely rather than shown disabled.
  const visibleServices = freeTest
    ? pricedServices.filter((s) => isFreeTestEligible(s.slug))
    : pricedServices

  return (
    <div>
      {freeTest && (
        <div className="free-test-capacity">
          <div className="free-test-capacity__head">
            <span className="free-test-capacity__label">Free Test Capacity</span>
            <span className="free-test-capacity__value">
              {freeTestCredits.used} / {TOTAL_FREE_TEST_CREDITS}
            </span>
          </div>
          <div className="free-test-capacity__track" role="presentation">
            <div
              className="free-test-capacity__fill"
              style={{ transform: `scaleX(${freeTestCredits.used / TOTAL_FREE_TEST_CREDITS})` }}
            />
          </div>
          <p className="free-test-capacity__remaining">
            {freeTestCredits.remaining === 0
              ? 'Free Test full — remove or reduce a service to add something else.'
              : `${freeTestCredits.remaining} credit${freeTestCredits.remaining === 1 ? '' : 's'} remaining`}
          </p>
          <p className="free-test-capacity__note">
            Standard image edits use 1 credit each. Advanced edits use 5 credits each.
          </p>
        </div>
      )}

      <span className="field__label">Select services</span>
      {!freeTest && <PartnerPricing />}
      <div className="select-grid">
        {visibleServices.map((s) => {
          const selected = order.services.includes(s.slug)
          const qtyValue = order.quantities[s.slug]?.qty ?? 0
          const propertiesValue = order.quantities[s.slug]?.properties ?? 1

          const cost = freeTest ? creditCostFor(s.slug) : 0
          // "Room left" already includes this service's own quantity, so the
          // field can always be lowered and raised again within its own slice.
          const freeTestMax = freeTest ? maxQtyFor(s.slug) : Infinity
          const canAdd = freeTest ? canAddImage(s.slug) : true
          // A service that can't afford even its first image can't be picked.
          const selectBlocked = freeTest && !selected && !canAdd

          return (
            <div
              key={s.slug}
              className={`select-card ${selected ? 'is-selected' : ''} ${selectBlocked ? 'is-unavailable' : ''}`}
            >
              <button
                type="button"
                className="select-card__toggle"
                onClick={() => toggleService(s.slug)}
                aria-pressed={selected}
                disabled={selectBlocked}
              >
                <span className="select-card__check" aria-hidden="true">
                  {selected && (
                    <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 5.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                  )}
                </span>
                <span className="select-card__heading">
                  <span className="select-card__name">{s.name}</span>
                  {!freeTest && isDiscounted(s) && (
                    <DiscountBadge percent={s.discountPercent} />
                  )}
                </span>
                {/* No prices on the card by design — the sticky Project Total
                    is the single place pricing is shown in Step 2. */}
                {freeTest && (
                  <span
                    className={`select-card__price ${isFreeTestGroupB(s.slug) ? 'is-advanced' : ''}`}
                  >
                    {creditLabelFor(s.slug)}
                  </span>
                )}
                {selectBlocked && (
                  <span className="select-card__note">
                    Needs {cost} credits — only {freeTestCredits.remaining} left.
                  </span>
                )}
              </button>

              {selected && !freeTest && (
                <div className="select-card__qty">
                  {/* Properties on the left, quantity on the right, one row
                      on desktop — stacking these doubled the card height. */}
                  <div className="select-card__qty-fields">
                    <Stepper
                      id={`props-${s.slug}`}
                      label="Properties"
                      value={propertiesValue}
                      min={1}
                      onChange={(n) => setQuantity(s.slug, 'properties', n)}
                    />
                    <Stepper
                      id={`qty-${s.slug}`}
                      label={unitLabel(s.unit, 2)}
                      value={qtyValue}
                      onChange={(n) => setQuantity(s.slug, 'qty', n)}
                    />
                  </div>

                </div>
              )}

              {selected && freeTest && (
                <div className="select-card__qty">
                  <Stepper
                    id={`qty-${s.slug}`}
                    label={unitLabel(s.unit, 2)}
                    value={qtyValue}
                    min={0}
                    max={freeTestMax}
                    disabledInc={!canAdd}
                    onChange={(n) => setQuantity(s.slug, 'qty', n)}
                    hint={
                      canAdd
                        ? `Using ${qtyValue * cost} of ${TOTAL_FREE_TEST_CREDITS} credits · ${freeTestCredits.remaining} left.`
                        : `Using ${qtyValue * cost} of ${TOTAL_FREE_TEST_CREDITS} credits · not enough capacity for another ${cost === 1 ? 'image' : `${cost}-credit image`}.`
                    }
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!freeTest && estimate.variable && (
        <p className="field__hint" style={{ marginTop: '1.5rem' }}>
          Some services are priced as a range, so the Project Total below is an estimate.
          We confirm the final amount after reviewing your files and project scope.
        </p>
      )}
    </div>
  )
}
