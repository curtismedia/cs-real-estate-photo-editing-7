import { useState } from 'react'
import { useBooking } from '../../context/BookingContext'
import { detailsErrors } from '../../lib/validation'

export default function StepDetails() {
  const { order, updateNested } = useBooking()
  const { details } = order
  const set = (patch) => updateNested('details', patch)

  // Errors are computed from state, but only *shown* once a field has been
  // visited — so the form does not shout at someone who has just arrived.
  const [touched, setTouched] = useState({})
  const errors = detailsErrors(details)
  const touch = (k) => setTouched((t) => ({ ...t, [k]: true }))
  const showError = (k) => (touched[k] ? errors[k] : null)

  return (
    <div>
      <div className="field-row">
        <div className="field">
          <label className="field__label" htmlFor="first">First name *</label>
          <input
            id="first" className="field__input" required value={details.firstName}
            aria-invalid={showError('firstName') ? 'true' : undefined}
            aria-describedby={showError('firstName') ? 'first-error' : undefined}
            onBlur={() => touch('firstName')}
            onChange={(e) => set({ firstName: e.target.value })}
          />
          {showError('firstName') && (
            <p className="field__error" id="first-error" role="alert">{errors.firstName}</p>
          )}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="last">Last name</label>
          <input id="last" className="field__input" value={details.lastName}
            onChange={(e) => set({ lastName: e.target.value })} />
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="email">Email *</label>
        <input
          id="email" type="email" className="field__input" required value={details.email}
          aria-invalid={showError('email') ? 'true' : undefined}
          aria-describedby={showError('email') ? 'email-error' : undefined}
          onBlur={() => touch('email')}
          onChange={(e) => set({ email: e.target.value })}
        />
        {showError('email') && (
          <p className="field__error" id="email-error" role="alert">{errors.email}</p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="phone">Phone number / WhatsApp *</label>
        <input
          id="phone" type="tel" inputMode="tel" className="field__input" required
          placeholder="+1 555 123 4567"
          value={details.phone}
          aria-invalid={showError('phone') ? 'true' : undefined}
          aria-describedby={showError('phone') ? 'phone-error' : 'phone-hint'}
          onBlur={() => touch('phone')}
          onChange={(e) => set({ phone: e.target.value })}
        />
        {showError('phone') ? (
          <p className="field__error" id="phone-error" role="alert">{errors.phone}</p>
        ) : (
          <p className="field__hint" id="phone-hint">
            One number for both — we’ll call or message you on WhatsApp at this line.
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="company">Company / Brokerage (optional)</label>
        <input id="company" className="field__input" value={details.company}
          onChange={(e) => set({ company: e.target.value })} />
      </div>

      <p className="field__hint">
        Project confirmation and payment instructions are sent to the email address above,
        so please make sure it is correct. We use your phone / WhatsApp number to reach you
        quickly if anything about the project needs clarifying.
      </p>
    </div>
  )
}
