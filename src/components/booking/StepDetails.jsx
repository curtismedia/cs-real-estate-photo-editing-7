import { useBooking } from '../../context/BookingContext'

export default function StepDetails() {
  const { order, updateNested } = useBooking()
  const { details } = order
  const set = (patch) => updateNested('details', patch)

  return (
    <div>
      <div className="field-row">
        <div className="field">
          <label className="field__label" htmlFor="first">First name *</label>
          <input id="first" className="field__input" required value={details.firstName}
            onChange={(e) => set({ firstName: e.target.value })} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="last">Last name</label>
          <input id="last" className="field__input" value={details.lastName}
            onChange={(e) => set({ lastName: e.target.value })} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field__label" htmlFor="email">Email *</label>
          <input id="email" type="email" className="field__input" required value={details.email}
            onChange={(e) => set({ email: e.target.value })} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" type="tel" className="field__input" value={details.phone}
            onChange={(e) => set({ phone: e.target.value })} />
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="company">Company / Brokerage (optional)</label>
        <input id="company" className="field__input" value={details.company}
          onChange={(e) => set({ company: e.target.value })} />
      </div>

      <p className="field__hint">
        Project confirmation and payment instructions are sent to the email address above,
        so please make sure it is correct.
      </p>
    </div>
  )
}
