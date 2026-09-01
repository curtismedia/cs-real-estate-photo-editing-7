import { contact } from '../../data/siteData'

/**
 * Preferred Partner Pricing.
 *
 * Deliberately NOT a negotiation widget: no target-price input, no offer
 * field, no automatic custom discount. It signals that tailored rates exist
 * for high-volume and ongoing clients, and routes those conversations to a
 * human by email or WhatsApp.
 *
 * Contact details come from siteData.js — the single place they are defined.
 */
const SUBJECT = 'Preferred Partner Pricing Inquiry'

const EMAIL_BODY = `Hi CS Real Estate Editing,

I'm interested in Preferred Partner Pricing for ongoing/high-volume editing work. I'd like to discuss our expected project volume and workflow.`

const WA_MESSAGE =
  "Hi, I'm interested in Preferred Partner Pricing for ongoing/high-volume real estate editing work. I'd like to discuss our expected project volume and workflow."

export const partnerEmailHref =
  `mailto:${contact.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`

export const partnerWhatsAppHref =
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(WA_MESSAGE)}`

/* Inline SVGs rather than a new dependency — two icons is not worth a package.
   Both use currentColor so they inherit the link colour and hover state. */
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1" y="3" width="14" height="10" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.4 3.6l6.6 4.8 6.6-4.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 1.6a6.3 6.3 0 0 0-5.4 9.5L1.7 14.4l3.4-.9A6.3 6.3 0 1 0 8 1.6Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M5.9 5.2c.2 0 .4 0 .5.3l.5 1.1c.1.2 0 .4-.1.5l-.3.3a3.9 3.9 0 0 0 2.1 2.1l.3-.3c.1-.2.3-.2.5-.1l1.1.5c.2.1.3.3.3.5 0 .7-.6 1.2-1.3 1.2A5.1 5.1 0 0 1 4.7 6.5c0-.7.5-1.3 1.2-1.3Z"
      fill="currentColor"
    />
  </svg>
)

/** Shared action pair, so the Step 2 box and Step 6 reminder cannot drift. */
export function PartnerActions() {
  return (
    <div className="partner__actions">
      <a className="link partner__action" href={partnerEmailHref}>
        <MailIcon /> Email us <span className="arrow" aria-hidden="true">→</span>
      </a>
      {/* New tab so a half-finished order is not lost. */}
      <a
        className="link partner__action"
        href={partnerWhatsAppHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon /> WhatsApp <span className="arrow" aria-hidden="true">→</span>
      </a>
    </div>
  )
}

/** Full box — Step 2, below "Select services". */
export default function PartnerPricing() {
  return (
    <aside className="partner">
      <div>
        <span className="partner__label">Preferred Partner Pricing</span>
        <p className="partner__text">
          For <strong>high-volume</strong> and <strong>ongoing clients</strong>, we offer{' '}
          <strong>better rates</strong> built around your regular workflow.{' '}
          <strong>Contact us</strong> via Email or WhatsApp to discuss your project volume.
        </p>
      </div>
      <PartnerActions />
    </aside>
  )
}

/** Compact reminder — Step 6, under the payment notes. */
export function PartnerReminder() {
  return (
    <aside className="partner partner--compact">
      <div>
        <span className="partner__label">Work with us regularly?</span>
        <p className="partner__text">
          <strong>High-volume</strong> and <strong>ongoing clients</strong> may qualify for
          Preferred Partner Pricing.
        </p>
      </div>
      <PartnerActions />
    </aside>
  )
}
