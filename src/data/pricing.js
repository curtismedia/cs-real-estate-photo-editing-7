// ---------------------------------------------------------------------------
// PRICING — single source of truth for every price on the site.
//
// Nothing else in the codebase hard-codes a price. Change a number here and
// the service cards, booking wizard, review step, payment summary and the
// Netlify submission all update together.
//
// Two kinds of price:
//   type: 'fixed'  → one rate. Subtotal = rate × qty. A confirmed number.
//   type: 'range'  → min/max rate. Subtotal is an ESTIMATED RANGE and is
//                    always presented as such. We never collapse a range into
//                    a single figure and pass it off as the final price.
// ---------------------------------------------------------------------------

import { services } from './services'

/** Rates keyed by service slug. `unit` is what the customer is counting. */
export const serviceRates = [
  { slug: 'video-editing',   type: 'range', min: 50,   max: 70,  unit: 'video' },
  { slug: 'virtual-staging', type: 'range', min: 30,   max: 40,  unit: 'image' },
  { slug: 'hdr',             type: 'fixed', rate: 0.8,           unit: 'image' },
  { slug: 'object-removal',  type: 'range', min: 2,    max: 5,   unit: 'image' },
  { slug: 'flambient',       type: 'fixed', rate: 1.0,           unit: 'image' },
  { slug: 'twilight',        type: 'fixed', rate: 3.0,           unit: 'image' },
  { slug: 'day-to-dusk',     type: 'fixed', rate: 5.0,           unit: 'image' },
  { slug: 'drone-aerial',    type: 'fixed', rate: 0.8,           unit: 'image' },
  { slug: 'single',          type: 'fixed', rate: 0.7,           unit: 'image' },
  { slug: 'floor-plan',      type: 'range', min: 25,   max: 35,  unit: 'plan' },
]

/** Plural label for a unit, e.g. 2 → "images". */
export const unitLabel = (unit, qty = 1) => {
  const one = { image: 'image', video: 'video', plan: 'floor plan' }[unit] || unit
  return qty === 1 ? one : `${one}s`
}

/** Rate record + the service name, so callers never re-look-up the name. */
export const getServiceRate = (slug) => {
  const rate = serviceRates.find((r) => r.slug === slug)
  if (!rate) return null
  const service = services.find((s) => s.slug === slug)
  return { ...rate, name: service?.name || slug, order: service?.order ?? 99 }
}

/** All priced services, in the display order defined in services.js. */
export const pricedServices = serviceRates
  .map((r) => getServiceRate(r.slug))
  .filter(Boolean)
  .sort((a, b) => a.order - b.order)

/** Deposit percentage offered as an alternative to paying in full. */
export const DEPOSIT_PERCENT = 50

// ---------------------------------------------------------------------------
// TURNAROUND — replaces the old calendar date/time delivery step.
//
// Three tiers, each with an allowed requested-hours window and a surcharge
// percentage applied to the service subtotal. This is the single source of
// truth for turnaround copy, ranges and fees — the selector cards, review
// step, Terms & Policies text and Netlify submission all read from here.
// ---------------------------------------------------------------------------
export const TURNAROUND_TYPES = {
  standard: {
    key: 'standard',
    label: 'Standard Turnaround',
    rangeLabel: '8–24 Hours',
    minHours: 8,
    maxHours: 24,
    feePercent: 0,
    feeLabel: 'No additional fee',
    defaultHours: 12,
    note: 'Standard turnaround is generally delivered within 8–24 hours depending on project scope.',
  },
  rush: {
    key: 'rush',
    label: 'Rush Turnaround',
    rangeLabel: '4–8 Hours',
    minHours: 4,
    maxHours: 8,
    feePercent: 30,
    feeLabel: '+30% Rush Fee',
    defaultHours: 6,
    note: 'Rush turnaround adds a 30% fee to the service subtotal and is subject to project scope.',
  },
  extreme: {
    key: 'extreme',
    label: 'Extreme Rush',
    rangeLabel: 'Under 4 Hours',
    minHours: 0,
    maxHours: 4,
    exclusiveMin: true,
    exclusiveMax: true,
    feePercent: 50,
    feeLabel: '+50% Extreme Rush Fee',
    defaultHours: 2,
    note: 'Extreme rush adds a 50% fee to the service subtotal and must be confirmed by our team before production begins.',
  },
}

export const turnaroundOrder = ['standard', 'rush', 'extreme']

export const getTurnaround = (type) => TURNAROUND_TYPES[type] || null

/** Validate a requested-hours value against the rules for a turnaround type. */
export function isValidTurnaroundHours(type, hours) {
  const t = getTurnaround(type)
  if (!t) return false
  const h = Number(hours)
  if (!Number.isFinite(h)) return false
  const minOk = t.exclusiveMin ? h > t.minHours : h >= t.minHours
  const maxOk = t.exclusiveMax ? h < t.maxHours : h <= t.maxHours
  return minOk && maxOk
}

export const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0)

/** "$16.00" for a fixed amount, "$6.00–$15.00" for a range. */
export const formatAmount = (min, max) =>
  min === max ? formatUSD(min) : `${formatUSD(min)}–${formatUSD(max)}`

/** "$0.80 / image" or "$2.00–$5.00 / image" — the per-unit rate. */
export const formatRate = (rate) => {
  if (!rate) return ''
  const price = rate.type === 'fixed' ? formatUSD(rate.rate) : `${formatUSD(rate.min)}–${formatUSD(rate.max)}`
  return `${price} / ${unitLabel(rate.unit, 1)}`
}

/**
 * Calculate an order estimate (the SERVICE SUBTOTAL only — no rush fee yet)
 * from per-service quantities.
 *
 * @param {object} order
 * @param {string[]} order.services      selected service slugs
 * @param {Record<string, {qty:number, properties:number}>} order.quantities  per-slug qty + property count
 * @param {boolean} order.freeTest
 * @returns {{
 *   lines: Array, min:number, max:number, variable:boolean, hasLines:boolean
 * }}
 */
export function calculateEstimate(order = {}) {
  const { services: selected = [], quantities = {}, freeTest = false } = order

  if (freeTest) {
    return { lines: [], min: 0, max: 0, variable: false, hasLines: false }
  }

  const lines = []
  let min = 0
  let max = 0

  for (const slug of selected) {
    const rate = getServiceRate(slug)
    if (!rate) continue

    const entry = quantities[slug] || {}
    const qty = Math.max(0, Number(entry.qty) || 0)
    const properties = Math.max(1, Number(entry.properties) || 1)
    const lineMin = (rate.type === 'fixed' ? rate.rate : rate.min) * qty
    const lineMax = (rate.type === 'fixed' ? rate.rate : rate.max) * qty

    min += lineMin
    max += lineMax

    lines.push({
      slug,
      name: rate.name,
      unit: rate.unit,
      qty,
      properties,
      variable: rate.type === 'range',
      rateText: formatRate(rate),
      min: lineMin,
      max: lineMax,
      /** e.g. "20 images × $0.80 / image" */
      qtyText: `${qty} ${unitLabel(rate.unit, qty)} × ${formatRate(rate)}`,
      /** e.g. "$16.00" or "Estimated $6.00–$15.00" */
      amountText:
        rate.type === 'range'
          ? `Estimated ${formatAmount(lineMin, lineMax)}`
          : formatUSD(lineMin),
    })
  }

  lines.sort((a, b) => (getServiceRate(a.slug)?.order ?? 0) - (getServiceRate(b.slug)?.order ?? 0))

  return {
    lines,
    min,
    max,
    variable: min !== max,
    hasLines: lines.length > 0,
  }
}

/**
 * Rush surcharge on top of the service subtotal.
 * `Rush Fee = Service Subtotal × feePercent`. Ranges stay ranges.
 *
 * @param {{min:number,max:number,variable:boolean}} estimate  service subtotal
 * @param {{type:string,hours:number}} turnaround
 */
export function calculateRushFee(estimate = { min: 0, max: 0 }, turnaround = {}) {
  const t = getTurnaround(turnaround.type) || TURNAROUND_TYPES.standard
  const percent = t.feePercent
  const feeMin = estimate.min * (percent / 100)
  const feeMax = estimate.max * (percent / 100)

  return {
    type: t.key,
    percent,
    feeMin,
    feeMax,
    variable: estimate.variable,
    hasFee: percent > 0,
    feeText: percent === 0 ? 'No additional fee' : `+${percent}%`,
    amountText: percent === 0 ? '$0.00' : formatAmount(feeMin, feeMax),
  }
}

/**
 * `Estimated Project Total = Service Subtotal + Rush Fee`.
 *
 * @param {{min:number,max:number}} estimate
 * @param {{feeMin:number,feeMax:number}} rushFee
 */
export function calculateProjectTotal(estimate = { min: 0, max: 0 }, rushFee = { feeMin: 0, feeMax: 0 }) {
  const min = estimate.min + rushFee.feeMin
  const max = estimate.max + rushFee.feeMax
  return {
    min,
    max,
    variable: min !== max,
    totalText: formatAmount(min, max),
  }
}

/**
 * Work out what the customer is asked to pay, given the payment choice.
 * Ranges stay ranges — a deposit on an estimated range is still an estimate.
 *
 * @param {{min:number,max:number,variable:boolean}} total  estimated project total (subtotal + rush fee)
 * @param {'full'|'deposit'} paymentOption
 */
export function calculatePayment(total, paymentOption = 'full') {
  const factor = paymentOption === 'deposit' ? DEPOSIT_PERCENT / 100 : 1
  const dueMin = total.min * factor
  const dueMax = total.max * factor

  return {
    paymentOption,
    isDeposit: paymentOption === 'deposit',
    variable: total.variable,
    totalText: formatAmount(total.min, total.max),
    dueMin,
    dueMax,
    dueText: formatAmount(dueMin, dueMax),
    remainingMin: total.min - dueMin,
    remainingMax: total.max - dueMax,
    remainingText: formatAmount(total.min - dueMin, total.max - dueMax),
  }
}

/**
 * Human-readable service breakdown for the Netlify submission.
 * Never produces "[object Object]".
 */
export function formatServicesForSubmission(estimate) {
  if (!estimate.hasLines) return 'None selected'
  return estimate.lines
    .map(
      (l) =>
        `${l.name} — ${l.qty} ${unitLabel(l.unit, l.qty)} — ${l.properties} ${l.properties === 1 ? 'property' : 'properties'} — ${l.amountText}`
    )
    .join('\n')
}
