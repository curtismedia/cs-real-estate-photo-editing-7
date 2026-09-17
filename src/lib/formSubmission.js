// ---------------------------------------------------------------------------
// FORM SUBMISSION — sends Contact / Booking / Free Test payloads to a Google
// Apps Script web app, which appends each submission as a row in a Google
// Sheet. Replaces Netlify Forms (src/lib/netlifyForms.js, removed), since
// GitHub Pages is static hosting with no form backend of its own.
//
// SETUP: see google-apps-script/Code.gs at the repo root for the script to
// deploy, and paste its Web app URL below.
// ---------------------------------------------------------------------------

/**
 * Deployed Google Apps Script "Web app" URL (ends in /exec).
 * See google-apps-script/Code.gs for the script and deployment steps.
 */
export const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'

/** Form names — kept identical to the old Netlify form names so payload
 * builders in src/lib/bookingSubmission.js needed no changes. */
export const FORM_NAMES = {
  booking: 'project-booking',
  freeTest: 'free-test-request',
  contact: 'contact-message',
}

/** Hidden field name a real visitor never fills in; a bot often does. */
export const HONEYPOT_FIELD = 'website'

/**
 * Submit a payload to the Google Apps Script backend.
 * Resolves on success; throws on any non-2xx / network / script-reported
 * error so the caller can keep the customer's data and show a real error.
 *
 * @param {string} formName one of FORM_NAMES
 * @param {Record<string, string|number>} payload
 */
export async function submitForm(formName, payload) {
  if (GOOGLE_SCRIPT_URL.includes('PASTE_YOUR_')) {
    throw new Error(
      'Form backend is not configured yet — set GOOGLE_SCRIPT_URL in src/lib/formSubmission.js.'
    )
  }

  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    // text/plain avoids a CORS preflight request, which Apps Script web apps
    // do not handle. The script still reads it as JSON via e.postData.contents.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      'form-name': formName,
      [HONEYPOT_FIELD]: '',
      ...payload,
    }),
  })

  if (!res.ok) {
    throw new Error(`Submission failed (${res.status}). Please try again in a moment.`)
  }

  const result = await res.json().catch(() => null)
  if (result && result.result === 'error') {
    throw new Error(result.message || 'Submission failed. Please try again.')
  }

  return true
}
