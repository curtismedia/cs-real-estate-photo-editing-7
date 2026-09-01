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

/** Shared action pair, so the Step 2 box and Step 6 reminder cannot drift. */
export function PartnerActions() {
  return (
    <div className="partner__actions">
      <a className="link" href={partnerEmailHref}>
        Email us <span className="arrow" aria-hidden="true">→</span>
      </a>
      {/* New tab so a half-finished order is not lost. */}
      <a className="link" href={partnerWhatsAppHref} target="_blank" rel="noopener noreferrer">
        WhatsApp <span className="arrow" aria-hidden="true">→</span>
      </a>
    </div>
  )
}

/** Full box — Step 2, below "Select services". */
export default function PartnerPricing() {
  return (
    <aside className="partner">
      <span className="partner__label">Preferred Partner Pricing</span>
      <p className="partner__text">
        For high-volume and ongoing clients, we offer tailored rates built around your regular
        workflow. Contact us via email or WhatsApp to discuss your project volume.
      </p>
      <PartnerActions />
    </aside>
  )
}

/** Compact reminder — Step 6, under the payment notes. */
export function PartnerReminder() {
  return (
    <aside className="partner partner--compact">
      <span className="partner__label">Work with us regularly?</span>
      <p className="partner__text">
        High-volume and ongoing clients may qualify for Preferred Partner Pricing.
      </p>
      <PartnerActions />
    </aside>
  )
}
