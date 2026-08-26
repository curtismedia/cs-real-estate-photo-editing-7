// ---------------------------------------------------------------------------
// NETLIFY FORMS — submission helper for a React + Vite single-page app.
//
// Netlify's build bot only discovers forms by parsing the STATIC HTML that is
// deployed. A React-rendered <form> is invisible to it. So:
//
//   1. index.html contains one hidden static form per form name, listing every
//      field. That is what registers the form with Netlify at deploy time.
//   2. At runtime we POST url-encoded data here, with `form-name` matching the
//      static form. That is what creates the actual submission.
//
// Keep the field names in index.html in sync with the payloads built in
// src/lib/bookingSubmission.js.
// ---------------------------------------------------------------------------

/** Form names — must match the hidden static forms in index.html exactly. */
export const FORM_NAMES = {
  booking: 'project-booking',
  freeTest: 'free-test-request',
  contact: 'contact-message',
}

/** Honeypot field name, also declared on the static forms. */
export const HONEYPOT_FIELD = 'bot-field'

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k] ?? '')}`)
    .join('&')

/**
 * Submit a payload to a Netlify form.
 * Resolves on success; throws on any non-2xx response or network failure so
 * the caller can keep the customer's data and show a real error.
 *
 * @param {string} formName one of FORM_NAMES
 * @param {Record<string, string|number>} payload
 */
export async function submitToNetlify(formName, payload) {
  const body = encode({
    'form-name': formName,
    [HONEYPOT_FIELD]: '',
    ...payload,
  })

  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    throw new Error(
      `Submission failed (${res.status}). Netlify Forms only runs on the deployed site — this will not work in local dev.`
    )
  }

  return true
}
