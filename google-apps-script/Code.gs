/**
 * GOOGLE APPS SCRIPT — form backend for CS Real Estate Photo Editing.
 *
 * Replaces Netlify Forms now that the site is hosted on GitHub Pages (which,
 * being static hosting, has no built-in form backend of its own).
 *
 * WHAT THIS DOES
 * Receives a JSON POST from the site's Contact form and Booking wizard, and
 * appends one row per submission to a Google Sheet — one sheet tab per form
 * name ("project-booking", "free-test-request", "contact-message"), created
 * automatically the first time each is submitted. Columns are created
 * automatically from whatever fields are in the payload, in the order they
 * first appear, so this file never needs to be updated when a field is added
 * or removed on the site side.
 *
 * ---------------------------------------------------------------------------
 * SETUP (one-time)
 * ---------------------------------------------------------------------------
 * 1. Create a new Google Sheet (this is where submissions will land).
 * 2. In that Sheet: Extensions → Apps Script.
 * 3. Delete the placeholder code in the editor and paste this whole file in.
 * 4. Click Deploy → New deployment.
 *      - Type: "Web app"
 *      - Execute as: "Me"
 *      - Who has access: "Anyone"
 *    (This does NOT expose your Sheet or Google account — it only exposes
 *    this one script's doPost() endpoint, which just appends rows.)
 * 5. Click Deploy, authorize the requested permissions (it needs to edit
 *    this one Sheet), and copy the "Web app URL" it gives you.
 * 6. Paste that URL as GOOGLE_SCRIPT_URL in src/lib/formSubmission.js.
 *
 * Whenever you edit this script after the first deploy, use
 * Deploy → Manage deployments → ✎ → New version, otherwise the live URL
 * keeps running the old code.
 * ---------------------------------------------------------------------------
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    var formName = data['form-name'] || 'unknown-form'

    // Simple honeypot: if the hidden 'website' field arrived non-empty, a
    // bot filled it in. Report success so the bot doesn't retry, but don't
    // record anything.
    if (data.website) {
      return jsonResponse({ result: 'success' })
    }

    var sheet = getOrCreateSheet_(formName)
    appendRow_(sheet, data)

    return jsonResponse({ result: 'success' })
  } catch (err) {
    return jsonResponse({ result: 'error', message: String(err) })
  }
}

function getOrCreateSheet_(formName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(formName)
  if (!sheet) {
    sheet = ss.insertSheet(formName)
  }
  return sheet
}

/** Appends `data` as a new row, adding any new keys as columns at the end. */
function appendRow_(sheet, data) {
  var lastCol = sheet.getLastColumn()
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : []

  // Always keep a received-at timestamp as the first column.
  if (headers.indexOf('received-at') === -1) {
    headers.unshift('received-at')
  }

  Object.keys(data).forEach(function (key) {
    if (headers.indexOf(key) === -1) headers.push(key)
  })

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])

  var row = headers.map(function (key) {
    if (key === 'received-at') return new Date()
    var value = data[key]
    return value === undefined || value === null ? '' : value
  })

  sheet.appendRow(row)
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  )
}
