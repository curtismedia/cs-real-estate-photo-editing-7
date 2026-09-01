// ---------------------------------------------------------------------------
// Customer-details validation.
//
// One place, used by BOTH the inline field errors in StepDetails and the
// Continue/Submit gate in BookingWizard. The HTML `required` attribute is a
// convenience for the browser — it is never what actually blocks submission,
// because the wizard submits via fetch() rather than a native form post.
// ---------------------------------------------------------------------------

const EMAIL_RE = /\S+@\S+\.\S+/

/** Digits only, so "+1 (555) 010-9999" counts as 11 digits, not 18 chars. */
const digitCount = (v) => (String(v || '').match(/\d/g) || []).length

/** Minimum plausible digits for an international phone number. */
const MIN_PHONE_DIGITS = 7

/**
 * @param {object} details order.details
 * @returns {Record<string,string>} field key → message. Empty object = valid.
 */
export function detailsErrors(details = {}) {
  const errors = {}

  if (!String(details.firstName || '').trim()) {
    errors.firstName = 'Please enter your first name.'
  }

  const email = String(details.email || '').trim()
  if (!email) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'

  // One number covers both channels — we message the same line on WhatsApp.
  const phone = String(details.phone || '').trim()
  if (!phone) errors.phone = 'Please enter a phone / WhatsApp number.'
  else if (digitCount(phone) < MIN_PHONE_DIGITS) {
    errors.phone = 'Please enter a complete phone number, including country code.'
  }

  return errors
}

/** True when every required detail is present and well-formed. */
export const detailsValid = (details) => Object.keys(detailsErrors(details)).length === 0
