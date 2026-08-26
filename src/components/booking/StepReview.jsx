import { useBooking } from '../../context/BookingContext'
import { formatAmount, DEPOSIT_PERCENT, TURNAROUND_TYPES } from '../../data/pricing'
import { getServiceName } from '../../data/services'
import { paymentNotes } from '../../data/policies'
import {
  TOTAL_FREE_TEST_CREDITS,
  GROUP_A_CREDIT_COST,
  GROUP_B_CREDIT_COST,
  creditCostFor,
} from '../../data/freeTestConfig'

function Row({ k, v }) {
  return (
    <div className="review__row">
      <span className="review__key">{k}</span>
      <span className="review__val">{v}</span>
    </div>
  )
}

export default function StepReview() {
  const { order, estimate, rushFee, total, payment, freeTest, freeTestCredits, update } = useBooking()

  const name = [order.details.firstName, order.details.lastName].filter(Boolean).join(' ') || '—'
  const contactLine = `${name}${order.details.email ? ' · ' + order.details.email : ''}`
  const turnaroundType = TURNAROUND_TYPES[order.turnaround.type]

  return (
    <div>
      {/* ---------- Services & quantities ---------- */}
      <span className="field__label">Selected services</span>
      <div className="billing">
        {/* Free tests have no pricing — just list what was requested. */}
        {freeTest ? (
          order.services.length ? (
            order.services.map((slug) => (
              <div className="billing__line" key={slug}>
                <div className="billing__line-main">
                  <span className="billing__name">{getServiceName(slug)}</span>
                  <span className="billing__qty">
                    {order.quantities[slug]?.qty ?? 0}{' '}
                    {(order.quantities[slug]?.qty ?? 0) === 1 ? 'image' : 'images'}
                  </span>
                </div>
                <span className="billing__amount">
                  {(order.quantities[slug]?.qty ?? 0) * creditCostFor(slug)} credits
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No services selected yet.</p>
          )
        ) : estimate.hasLines ? (
          estimate.lines.map((l) => (
            <div className="billing__line" key={l.slug}>
              <div className="billing__line-main">
                <span className="billing__name">{l.name}</span>
                <span className="billing__qty">
                  {l.qtyText}
                  {l.properties !== 1 && ` · ${l.properties} properties`}
                </span>
              </div>
              <span className={`billing__amount ${l.variable ? 'is-estimate' : ''}`}>
                {l.amountText}
              </span>
            </div>
          ))
        ) : (
          <p className="muted">No services selected yet.</p>
        )}
      </div>

      {/* ---------- Pricing — one compact breakdown, turnaround folded in ---------- */}
      {!freeTest && estimate.hasLines && (
        <div className="review__section">
          <span className="field__label">Pricing</span>
          <Row k="Services" v={`${estimate.variable ? 'Estimated ' : ''}${formatAmount(estimate.min, estimate.max)}`} />
          {rushFee.hasFee ? (
            <Row
              k={`${turnaroundType.label.replace(' Turnaround', '')} Turnaround ( +${rushFee.percent}% )`}
              v={`${rushFee.variable ? 'Estimated ' : ''}+${rushFee.amountText}`}
            />
          ) : (
            <Row k="Standard Turnaround" v="Included" />
          )}
        </div>
      )}

      {!freeTest && estimate.hasLines && (
        <div className="review__total">
          <span className="label">
            {total.variable ? 'Estimated project total' : 'Project total'}
          </span>
          <span className="review__total-amount">
            {formatAmount(total.min, total.max)}
          </span>
        </div>
      )}
      {!freeTest && estimate.hasLines && (
        <p className="field__hint">
          Requested turnaround: {order.turnaround.hours} hours ({turnaroundType.rangeLabel}).
        </p>
      )}
      {!freeTest && total.variable && (
        <p className="field__hint">
          This project includes services with variable pricing, so the total above is an estimated
          range. Your final price is confirmed by our team after we review your files and project
          requirements.
        </p>
      )}

      {/* ---------- Project details ---------- */}
      <div className="review__section">
        <span className="field__label">Project details</span>
        <Row k="Project type" v={freeTest ? 'Free Test' : 'Paid Project'} />
        <Row k="Files" v={order.files.link || 'Not provided yet'} />
        {order.files.reference && <Row k="Reference" v={order.files.reference} />}
        <Row k="Contact" v={contactLine} />
      </div>

      {/* ---------- Payment option ---------- */}
      {!freeTest && (
        <div className="review__section">
          <span className="field__label">Payment option</span>

          <fieldset className="payment-options">
            <legend className="sr-only">Choose how you would like to pay</legend>

            <label className={`payment-option ${order.paymentOption === 'full' ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="payment-option"
                value="full"
                checked={order.paymentOption === 'full'}
                onChange={() => update({ paymentOption: 'full' })}
              />
              <span className="payment-option__body">
                <span className="payment-option__name">Pay in Full — 100%</span>
                <span className="payment-option__desc">
                  The full confirmed amount is requested once your project is approved.
                </span>
              </span>
            </label>

            <label className={`payment-option ${order.paymentOption === 'deposit' ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="payment-option"
                value="deposit"
                checked={order.paymentOption === 'deposit'}
                onChange={() => update({ paymentOption: 'deposit' })}
              />
              <span className="payment-option__body">
                <span className="payment-option__name">{DEPOSIT_PERCENT}% Deposit</span>
                <span className="payment-option__desc">
                  Pay half up front; the balance is due before final delivery.
                </span>
              </span>
            </label>
          </fieldset>

          <div className="payment-summary">
            <div className="payment-summary__row">
              <span>{total.variable ? 'Estimated project total' : 'Project total'}</span>
              <span>{payment.totalText}</span>
            </div>
            <div className="payment-summary__row payment-summary__row--strong">
              <span>
                {payment.isDeposit
                  ? total.variable ? 'Estimated deposit due' : 'Deposit due'
                  : total.variable ? 'Estimated amount due' : 'Amount due'}
              </span>
              <span>{payment.dueText}</span>
            </div>
            {payment.isDeposit && (
              <div className="payment-summary__row">
                <span>{total.variable ? 'Estimated remaining balance' : 'Remaining balance'}</span>
                <span>{payment.remainingText}</span>
              </div>
            )}
          </div>

          <div className="payment-note">
            {paymentNotes.map((note, i) => (
              <p key={i}>{note}</p>
            ))}
          </div>
        </div>
      )}

      {freeTest && (
        <div className="review__section">
          <span className="field__label">Free Test capacity</span>
          <Row
            k="Group A — standard edits"
            v={`${freeTestCredits.groupA} ${freeTestCredits.groupA === 1 ? 'image' : 'images'} = ${freeTestCredits.groupA * GROUP_A_CREDIT_COST} credits`}
          />
          <Row
            k="Group B — advanced edits"
            v={`${freeTestCredits.groupB} ${freeTestCredits.groupB === 1 ? 'image' : 'images'} = ${freeTestCredits.groupB * GROUP_B_CREDIT_COST} credits`}
          />
          <div className="review__total">
            <span className="label">Total capacity used</span>
            <span className="review__total-amount">
              {freeTestCredits.used} / {TOTAL_FREE_TEST_CREDITS}
            </span>
          </div>
          <p className="field__hint">
            Free Test — nothing to pay. Standard image edits use 1 credit each, advanced edits
            use 5 credits each.
          </p>
        </div>
      )}
    </div>
  )
}
