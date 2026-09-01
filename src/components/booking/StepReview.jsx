import { useBooking } from '../../context/BookingContext'
import { DEPOSIT_PERCENT, TURNAROUND_TYPES } from '../../data/pricing'
import DiscountBadge from './DiscountBadge'
import { PartnerReminder } from './PartnerPricing'
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
  const { order, estimate, rushFee, totals, total, payment, freeTest, freeTestCredits, update } = useBooking()

  const name = [order.details.firstName, order.details.lastName].filter(Boolean).join(' ') || '—'
  const contactLine = `${name}${order.details.email ? ' · ' + order.details.email : ''}`
  const turnaroundType = TURNAROUND_TYPES[order.turnaround.type]

  return (
    <div>
      {/* ---------- Paid project: order review (left) + payment (right) ----
          Two columns on desktop so the payment options sit beside the pricing
          instead of a screen below it. Stacks on narrow viewports. */}
      {!freeTest ? (
        <div className="review-grid">
          <div className="review-grid__main">
            <span className="field__label">Selected services</span>
            <div className="billing">
              {estimate.hasLines ? (
                estimate.lines.map((l) => (
                  <div className="billing__line" key={l.slug}>
                    <div className="billing__line-main">
                      <span className="billing__name">
                        {l.name}
                        {l.discountPercent > 0 && <DiscountBadge percent={l.discountPercent} />}
                      </span>
                      <span className="billing__qty">
                        {l.qtyText}
                        {l.properties !== 1 && ` · ${l.properties} properties`}
                      </span>
                    </div>
                    <span className={`billing__amount ${l.variable ? 'is-estimate' : ''}`}>
                      {l.savingsMax > 0 && (
                        <s className="billing__compare">{l.compareAmountText}</s>
                      )}
                      {l.amountText}
                    </span>
                  </div>
                ))
              ) : (
                <p className="muted">No services selected yet.</p>
              )}

              {/* Turnaround sits with the services it applies to, not down in
                  the money column. */}
              {estimate.hasLines && (
                <div className="billing__line billing__line--turnaround">
                  <div className="billing__line-main">
                    <span className="billing__name">
                      {turnaroundType.label}
                      {rushFee.hasFee && ` (+${rushFee.percent}%)`}
                    </span>
                    <span className="billing__qty">
                      Requested in {order.turnaround.hours} hours · {turnaroundType.rangeLabel}
                    </span>
                  </div>
                  <span className="billing__amount">
                    {rushFee.hasFee
                      ? `+${rushFee.variable ? 'Est. ' : ''}${rushFee.amountText}`
                      : 'No additional fee'}
                  </span>
                </div>
              )}
            </div>

            {/* Three figures, one right-aligned money column. */}
            {estimate.hasLines && (
              <div className="totals">
                <div className="totals__row">
                  <span className="totals__label">Total</span>
                  <span className="totals__value">{totals.totalText}</span>
                </div>
                <div className="totals__row">
                  <span className="totals__label">Savings</span>
                  <span className="totals__value totals__value--save">
                    {totals.hasSavings ? `−${totals.savingsText}` : '$0.00'}
                  </span>
                </div>
                <div className="totals__row totals__row--final">
                  <span className="totals__label">Subtotal</span>
                  <span className="totals__value">{totals.subtotalText}</span>
                </div>
              </div>
            )}

            {estimate.hasLines && totals.variable && (
              <p className="field__hint">
                This project includes services with variable pricing, so the figures above are an
                estimated range. Your final price is confirmed by our team after we review your
                files and project requirements.
              </p>
            )}
          </div>

          <div className="review-grid__aside">
            <span className="field__label">Payment options</span>

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

            <PartnerReminder />
          </div>
        </div>
      ) : (
        <>
          <span className="field__label">Selected services</span>
          <div className="billing">
            {order.services.length ? (
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
            )}
          </div>
        </>
      )}

      {/* ---------- Project details ---------- */}
      <div className="review__section">
        <span className="field__label">Project details</span>
        <Row k="Project type" v={freeTest ? 'Free Test' : 'Paid Project'} />
        <Row k="Files" v={order.files.link || 'Not provided yet'} />
        {order.files.reference && <Row k="Reference" v={order.files.reference} />}
        <Row k="Contact" v={contactLine} />
      </div>

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
