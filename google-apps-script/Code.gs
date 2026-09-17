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
 * automatically the first time each is submitted, with a formatted header
 * row (bold, colored, frozen), auto-sized columns and a color-coded tab.
 * Columns are created automatically from whatever fields are in the payload,
 * in the order they first appear, so this file never needs to be updated
 * when a field is added or removed on the site side.
 *
 * Phone-like fields (phone, whatsapp) are forced to plain-text formatting
 * before being written — a value starting with '+' (e.g. '+84...') would
 * otherwise be misread by Sheets as the start of a formula and show #ERROR!.
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

// Columns that must be stored as plain text (never auto-parsed as a formula
// or a number) — anything that can start with '+', a leading zero, etc.
var TEXT_ONLY_FIELDS = ['phone', 'whatsapp', 'customer-email', 'email']

// One tab color per form, purely cosmetic, so the Sheet's tab bar reads at
// a glance. Add an entry here if a new form name is introduced.
var TAB_COLORS = {
  'project-booking': '#1a73e8', // blue
  'free-test-request': '#e8710a', // orange
  'contact-message': '#188038', // green
}

var HEADER_BG = '#1a1917' // matches the site's dark theme
var HEADER_FG = '#ffffff'

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
    if (TAB_COLORS[formName]) sheet.setTabColor(TAB_COLORS[formName])
    sheet.setFrozenRows(1)
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

  var headersChanged = false
  Object.keys(data).forEach(function (key) {
    if (headers.indexOf(key) === -1) {
      headers.push(key)
      headersChanged = true
    }
  })

  var headerRange = sheet.getRange(1, 1, 1, headers.length)
  headerRange.setValues([headers])
  formatHeaderRow_(sheet, headerRange)

  var rowIndex = sheet.getLastRow() + 1
  var dataRange = sheet.getRange(rowIndex, 1, 1, headers.length)

  // Force plain-text formatting on any column whose name is a known
  // phone/email-like field, on any new column just added, and on 'received-at'
  // stays a real date. This must happen BEFORE setValues, or Sheets may have
  // already parsed the incoming value as a formula/number.
  headers.forEach(function (key, i) {
    if (key === 'received-at') {
      dataRange.getCell(1, i + 1).setNumberFormat('dd/mm/yyyy hh:mm:ss')
    } else if (TEXT_ONLY_FIELDS.indexOf(key) !== -1 || headersChanged) {
      dataRange.getCell(1, i + 1).setNumberFormat('@')
    }
  })

  var row = headers.map(function (key) {
    if (key === 'received-at') return new Date()
    var value = data[key]
    if (value === undefined || value === null) return ''
    // Belt-and-suspenders: a leading +/=/-/@ would otherwise still be read
    // as a formula start even on a '@'-formatted cell in some edge cases,
    // so also prefix a literal apostrophe is unnecessary once the number
    // format is '@' — Sheets then always treats the value as text.
    return value
  })

  dataRange.setValues([row])

  autoResizeColumns_(sheet, headers.length)
}

function formatHeaderRow_(sheet, headerRange) {
  headerRange
    .setFontWeight('bold')
    .setFontColor(HEADER_FG)
    .setBackground(HEADER_BG)
    .setVerticalAlignment('middle')
  sheet.setFrozenRows(1)
}

function autoResizeColumns_(sheet, columnCount) {
  // Cap the width so a long "instructions"/"message" column doesn't blow out
  // the whole sheet — auto-resize first, then clamp anything oversized.
  sheet.autoResizeColumns(1, columnCount)
  for (var c = 1; c <= columnCount; c++) {
    if (sheet.getColumnWidth(c) > 260) sheet.setColumnWidth(c, 260)
  }
}

/**
 * ONE-TIME CLEANUP — run this manually once (Apps Script editor → select
 * "cleanupExistingSheets" in the function dropdown → Run) to reformat every
 * existing tab created before this styling was added, and to fix any
 * existing #ERROR! cells caused by a '+'-prefixed phone number.
 *
 * Safe to re-run any time; it only reformats, it never deletes data.
 */
function cleanupExistingSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.getSheets().forEach(function (sheet) {
    var lastCol = sheet.getLastColumn()
    var lastRow = sheet.getLastRow()
    if (lastCol === 0 || lastRow === 0) return

    var formName = sheet.getName()
    if (TAB_COLORS[formName]) sheet.setTabColor(TAB_COLORS[formName])

    var headerRange = sheet.getRange(1, 1, 1, lastCol)
    formatHeaderRow_(sheet, headerRange)
    var headers = headerRange.getValues()[0]

    if (lastRow > 1) {
      headers.forEach(function (key, i) {
        var col = i + 1
        if (key === 'received-at') {
          sheet.getRange(2, col, lastRow - 1, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss')
          return
        }
        if (TEXT_ONLY_FIELDS.indexOf(key) === -1) return

        // Re-write existing values as plain text to clear any #ERROR! that
        // came from a '+'-prefixed value being parsed as a formula. Sheets
        // still has the original text as that cell's "formula" (e.g.
        // '+84398648657'), so read it back from there to recover the real
        // phone number instead of losing it.
        var range = sheet.getRange(2, col, lastRow - 1, 1)
        var values = range.getValues()
        var formulas = range.getFormulas()
        range.setNumberFormat('@')
        var fixed = values.map(function (r, i) {
          var v = r[0]
          var isError = typeof v === 'string' && v.indexOf('#ERROR') !== -1
          if (isError) return [formulas[i][0] || '']
          return [v === null || v === undefined ? '' : String(v)]
        })
        range.setValues(fixed)
      })
    }

    autoResizeColumns_(sheet, lastCol)
  })
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  )
}
