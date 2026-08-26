import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../../hooks/useSEO'
import { contact, cta } from '../../data/siteData'
import { submitToNetlify, FORM_NAMES } from '../../lib/netlifyForms'
import '../../components/booking/booking.css'
import './Contact.css'

export default function Contact() {
  useSEO({
    title: 'Contact CS Real Estate Photo Editing',
    description: 'Get in touch with CS Real Estate Photo Editing, or request a free 10-image editing test.',
  })

  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | error | success
  const [error, setError] = useState('')
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.message.trim()

  const submit = async (e) => {
    e.preventDefault()
    if (!valid || status === 'submitting') return
    setStatus('submitting')
    setError('')
    try {
      await submitToNetlify(FORM_NAMES.contact, {
        name: form.name,
        email: form.email,
        company: form.company || 'Not provided',
        message: form.message,
        'submitted-at': new Date().toISOString(),
      })
      setStatus('success')
    } catch (err) {
      // Keep everything the visitor typed so they can retry.
      setError(err?.message || 'Network error.')
      setStatus('error')
    }
  }

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="label">Contact</span>
          <h1 className="display page-intro__title">Let’s talk.</h1>
        </div>
      </section>

      <section className="section--tight">
        <div className="container contact__grid">
          <div className="contact__info">
            <div>
              <span className="label">Email</span>
              <a href={`mailto:${contact.email}`} className="contact__link">{contact.email}</a>
            </div>
            <div>
              <span className="label">Phone / WhatsApp</span>
              <a href={contact.phoneHref} className="contact__link">{contact.phone}</a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="link contact__whatsapp"
              >
                Message us on WhatsApp <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
            <div>
              <span className="label">Studio</span>
              <address className="contact__address">
                {contact.address.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>
            <div>
              <span className="label">Instagram</span>
              <a
                href="https://www.instagram.com/curtis.remedia/"
                target="_blank"
                rel="noreferrer"
                className="contact__link"
              >
                @curtis.remedia
              </a>
            </div>
            <div>
              <span className="label">Hours</span>
              <p className="muted">{contact.hours}</p>
            </div>
          </div>

          <div className="contact__form-wrap">
            {status === 'success' ? (
              <div className="contact__sent">
                <h2 className="h3">Message sent.</h2>
                <p className="muted">Thanks — we’ll get back to you shortly. Please check your spam folder for our reply.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="field">
                  <label className="field__label" htmlFor="c-name">Name *</label>
                  <input id="c-name" className="field__input" required value={form.name} onChange={(e) => set({ name: e.target.value })} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="c-email">Email *</label>
                  <input id="c-email" type="email" className="field__input" required value={form.email} onChange={(e) => set({ email: e.target.value })} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="c-company">Company (optional)</label>
                  <input id="c-company" className="field__input" value={form.company} onChange={(e) => set({ company: e.target.value })} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="c-message">Message *</label>
                  <textarea id="c-message" className="field__textarea" required value={form.message} onChange={(e) => set({ message: e.target.value })} />
                </div>

                {status === 'error' && (
                  <div className="form-error" role="alert">
                    <strong>We couldn’t send your message.</strong>
                    <p>{error}</p>
                    <p>Your message has been kept — press send again to retry, or email us directly.</p>
                  </div>
                )}

                <button type="submit" className="btn btn--solid" disabled={!valid || status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Send message'} <span className="arrow" aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container contact__free">
          <div>
            <span className="label">Not ready to order?</span>
            <h2 className="h2 contact__free-title">Test our editing with 10 images, completely free.</h2>
          </div>
          <Link to={cta.primary.to} className="btn btn--light">
            {cta.primary.label} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
