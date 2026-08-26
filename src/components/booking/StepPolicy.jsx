import { useBooking } from '../../context/BookingContext'
import { policies, policyIntro, POLICY_ACCEPT_LABEL } from '../../data/policies'

export default function StepPolicy() {
  const { order, updateNested, payment, total, estimate, freeTest, status, errorMessage } = useBooking()
  const { consent } = order

  return (
    <div>
      {!freeTest && estimate.hasLines && (
        <div className="payment-summary payment-summary--lead">
          <div className="payment-summary__row payment-summary__row--strong">
            <span>
              {payment.isDeposit
                ? total.variable ? 'Estimated deposit due' : 'Deposit due'
                : total.variable ? 'Estimated amount due' : 'Amount due'}
            </span>
            <span>{payment.dueText}</span>
          </div>
          <p className="field__hint">
            {payment.isDeposit
              ? 'Payment instructions for your deposit will be emailed once the project is confirmed.'
              : 'Payment instructions will be emailed once the project is confirmed.'}
          </p>
        </div>
      )}

      <div className="policies">
        <span className="field__label">Service Terms &amp; Policies</span>
        <p className="muted policies__intro">{policyIntro}</p>

        <div className="policies__list">
          {policies.map((p) => (
            <section className="policy" key={p.id}>
              <h3 className="policy__title">{p.title}</h3>
              {p.body.map((line, i) => (
                <p className="policy__text" key={i}>{line}</p>
              ))}
            </section>
          ))}
        </div>
      </div>

      <div className="consent">
        <input
          id="c-policy"
          type="checkbox"
          required
          checked={consent.policy}
          onChange={(e) => updateNested('consent', { policy: e.target.checked })}
        />
        <label htmlFor="c-policy">{POLICY_ACCEPT_LABEL}</label>
      </div>

      {status === 'error' && (
        <div className="form-error" role="alert">
          <strong>We couldn’t send your request.</strong>
          <p>{errorMessage || 'Something went wrong. Please try again.'}</p>
          <p>Your details have been kept — press submit again to retry.</p>
        </div>
      )}
    </div>
  )
}
