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

// ---------------------------------------------------------------------------
// PROMOTION — "Today Only" sale.
//
// Every price below is stored as the COMPARE-AT (pre-sale) rate plus a
// discountPercent. The sale rate is derived, never typed twice, so the two can
// never drift apart. Set `PROMO.active = false` to end the sale: sale rates
// collapse back to compare-at, savings become zero, and the banner disappears
// without touching any other file.
// ---------------------------------------------------------------------------
export const PROMO = {
  active: true,
  /** Banner copy. */
  headline: 'UP TO 15% OFF ALL SERVICES',
  /** Shown on the Paid Project card in Step 1. */
  stepOneBadge: 'UP TO 15% OFF — TODAY ONLY',
  /** Countdown runs on this clock for every visitor, worldwide. */
  timezone: 'America/Chicago',
  /** Recorded on the order so support can see which promo was applied. */
  submissionLabel: 'Up to 15% OFF — Today Only',
}

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

/** Apply the service's discount to a compare-at figure. */
const saleOf = (compare, percent) =>
  PROMO.active ? round2(compare * (1 - percent / 100)) : round2(compare)

/**
 * COMPARE-AT rates keyed by service slug. `unit` is what the customer counts.
 * `discountPercent` is the sale applied to that service.
 *
 * `rate` / `min` / `max` are the COMPARE-AT (struck-through) figures.
 * `saleRate` / `saleMin` / `saleMax` are derived below and are what every
 * calculation actually charges.
 */
const COMPARE_RATES = [
  { slug: 'video-editing',   type: 'range', min: 50,   max: 70,  unit: 'video', discountPercent: 10 },
  { slug: 'virtual-staging', type: 'range', min: 30,   max: 40,  unit: 'image', discountPercent: 10 },
  { slug: 'hdr',             type: 'fixed', rate: 1.0,           unit: 'image', discountPercent: 15 },
  { slug: 'object-removal',  type: 'range', min: 2,    max: 5,   unit: 'image', discountPercent: 10 },
  { slug: 'flambient',       type: 'fixed', rate: 1.0,           unit: 'image', discountPercent: 10 },
  { slug: 'twilight',        type: 'fixed', rate: 3.0,           unit: 'image', discountPercent: 10 },
  { slug: 'day-to-dusk',     type: 'fixed', rate: 5.0,           unit: 'image', discountPercent: 10 },
  { slug: 'drone-aerial',    type: 'fixed', rate: 1.0,           unit: 'image', discountPercent: 15 },
  { slug: 'single',          type: 'fixed', rate: 0.7,           unit: 'image', discountPercent: 10 },
  { slug: 'floor-plan',      type: 'range', min: 25,   max: 35,  unit: 'plan',  discountPercent: 10 },
]

/** Compare-at rates with their derived sale rates attached. */
export const serviceRates = COMPARE_RATES.map((r) => {
  const percent = PROMO.active ? r.discountPercent : 0
  if (r.type === 'fixed') {
    return { ...r, discountPercent: percent, saleRate: saleOf(r.rate, percent) }
  }
  return {
    ...r,
    discountPercent: percent,
    saleMin: saleOf(r.min, percent),
    saleMax: saleOf(r.max, percent),
  }
})

/** Compare-at per-unit figures for a rate record. */
export const compareUnit = (rate) =>
  rate.type === 'fixed' ? { min: rate.rate, max: rate.rate } : { min: rate.min, max: rate.max }

/** Sale per-unit figures for a rate record — what we actually charge. */
export const saleUnit = (rate) =>
  rate.type === 'fixed'
    ? { min: rate.saleRate, max: rate.saleRate }
    : { min: rate.saleMin, max: rate.saleMax }

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
    // Default to the MAXIMUM of the tier — the customer narrows it if they want.
    defaultHours: 24,
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
    defaultHours: 8,
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
    // Exclusive max, so the highest valid whole hour under 4.
    defaultHours: 3,
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

/** "$0.85 / image" or "$1.80–$4.50 / image" — the per-unit SALE rate. */
export const formatRate = (rate) => {
  if (!rate) return ''
  const u = saleUnit(rate)
  return `${formatAmount(u.min, u.max)} / ${unitLabel(rate.unit, 1)}`
}

/** "$1.00 / image" — the struck-through compare-at rate. */
export const formatCompareRate = (rate) => {
  if (!rate) return ''
  const u = compareUnit(rate)
  return `${formatAmount(u.min, u.max)} / ${unitLabel(rate.unit, 1)}`
}

/** True when this service's price is actually reduced right now. */
export const isDiscounted = (rate) =>
  Boolean(rate) && rate.discountPercent > 0 && saleUnit(rate).min < compareUnit(rate).min

/**
 * Calculate an order estimate (the SERVICE SUBTOTAL only — no rush fee yet).
 *
 * `min` / `max` are the DISCOUNTED subtotal — everything downstream (rush fee,
 * project total, deposit, submission) builds on those, so the sale is applied
 * exactly once, at this single point.
 *
 * @param {object} order
 * @param {string[]} order.services      selected service slugs
 * @param {Record<string, {qty:number, properties:number}>} order.quantities
 * @param {boolean} order.freeTest       Free Test has no pricing at all
 */
export function calculateEstimate(order = {}) {
  const { services: selected = [], quantities = {}, freeTest = false } = order

  if (freeTest) {
    return {
      lines: [], min: 0, max: 0, compareMin: 0, compareMax: 0,
      savingsMin: 0, savingsMax: 0, hasSavings: false,
      variable: false, hasLines: false,
    }
  }

  const lines = []
  let min = 0
  let max = 0
  let compareMin = 0
  let compareMax = 0

  for (const slug of selected) {
    const rate = getServiceRate(slug)
    if (!rate) continue

    const entry = quantities[slug] || {}
    const qty = Math.max(0, Number(entry.qty) || 0)
    const properties = Math.max(1, Number(entry.properties) || 1)

    const sale = saleUnit(rate)
    const compare = compareUnit(rate)

    const lineMin = round2(sale.min * qty)
    const lineMax = round2(sale.max * qty)
    const lineCompareMin = round2(compare.min * qty)
    const lineCompareMax = round2(compare.max * qty)

    min += lineMin
    max += lineMax
    compareMin += lineCompareMin
    compareMax += lineCompareMax

    lines.push({
      slug,
      name: rate.name,
      unit: rate.unit,
      qty,
      properties,
      variable: rate.type === 'range',
      discountPercent: rate.discountPercent,
      rateText: formatRate(rate),
      compareRateText: formatCompareRate(rate),
      /** Discounted line total — this is what the customer pays. */
      min: lineMin,
      max: lineMax,
      /** Pre-sale line total, for the struck-through figure and savings. */
      compareMin: lineCompareMin,
      compareMax: lineCompareMax,
      savingsMin: round2(lineCompareMin - lineMin),
      savingsMax: round2(lineCompareMax - lineMax),
      /** e.g. "20 images × $0.72 / image" */
      qtyText: `${qty} ${unitLabel(rate.unit, qty)} × ${formatRate(rate)}`,
      /** e.g. "$14.40" or "Estimated $36.00–$90.00" */
      amountText:
        rate.type === 'range'
          ? `Estimated ${formatAmount(lineMin, lineMax)}`
          : formatUSD(lineMin),
      compareAmountText: formatAmount(lineCompareMin, lineCompareMax),
    })
  }

  lines.sort((a, b) => (getServiceRate(a.slug)?.order ?? 0) - (getServiceRate(b.slug)?.order ?? 0))

  min = round2(min)
  max = round2(max)
  compareMin = round2(compareMin)
  compareMax = round2(compareMax)

  const savingsMin = round2(compareMin - min)
  const savingsMax = round2(compareMax - max)

  return {
    lines,
    min,
    max,
    compareMin,
    compareMax,
    savingsMin,
    savingsMax,
    hasSavings: savingsMax > 0,
    savingsText: formatAmount(savingsMin, savingsMax),
    variable: min !== max,
    hasLines: lines.length > 0,
  }
}

/**
 * Turnaround surcharge.
 *
 * IMPORTANT: the fee is a percentage of the COMPARE-AT (pre-sale) service
 * subtotal, not the discounted one. Rush is a cost of doing the work fast —
 * it is not part of what the promotion discounts.
 *
 * @param {{compareMin:number,compareMax:number,variable:boolean}} estimate
 * @param {{type:string,hours:number}} turnaround
 */
export function calculateRushFee(estimate = { compareMin: 0, compareMax: 0 }, turnaround = {}) {
  const t = getTurnaround(turnaround.type) || TURNAROUND_TYPES.standard
  const percent = t.feePercent
  // Round to cents so a float artifact never reaches the total
  // (0.30 × 25 is fine, but 0.30 × 72 is 21.599999999999998).
  const feeMin = round2((estimate.compareMin || 0) * (percent / 100))
  const feeMax = round2((estimate.compareMax || 0) * (percent / 100))

  return {
    type: t.key,
    percent,
    feeMin,
    feeMax,
    variable: Boolean(estimate.variable),
    hasFee: percent > 0,
    feeText: percent === 0 ? 'No additional fee' : `+${percent}%`,
    amountText: percent === 0 ? '$0.00' : formatAmount(feeMin, feeMax),
  }
}

/**
 * The three figures shown in the Step 6 summary.
 *
 *   Total    = compare-at service subtotal + turnaround fee
 *              (what the order would cost at full price)
 *   Savings  = compare-at subtotal − sale subtotal
 *   Subtotal = Total − Savings   ← what the customer actually pays
 *
 * Because Savings is derived from the difference between two independently
 * summed figures, the discount can never be applied twice.
 *
 * @param {ReturnType<calculateEstimate>} estimate
 * @param {ReturnType<calculateRushFee>} rushFee
 */
export function calculateOrderTotals(estimate, rushFee) {
  const totalMin = round2(estimate.compareMin + rushFee.feeMin)
  const totalMax = round2(estimate.compareMax + rushFee.feeMax)
  const savingsMin = estimate.savingsMin
  const savingsMax = estimate.savingsMax
  const subtotalMin = round2(totalMin - savingsMin)
  const subtotalMax = round2(totalMax - savingsMax)

  return {
    totalMin,
    totalMax,
    totalText: formatAmount(totalMin, totalMax),
    savingsMin,
    savingsMax,
    savingsText: formatAmount(savingsMin, savingsMax),
    hasSavings: savingsMax > 0,
    subtotalMin,
    subtotalMax,
    subtotalText: formatAmount(subtotalMin, subtotalMax),
    variable: subtotalMin !== subtotalMax,
  }
}

/**
 * What the customer pays — the Subtotal from `calculateOrderTotals`, exposed
 * in the {min,max} shape the payment/summary code already expects.
 */
export function calculateProjectTotal(estimate = {}, rushFee = { feeMin: 0, feeMax: 0 }) {
  const t = calculateOrderTotals(
    {
      compareMin: estimate.compareMin || 0,
      compareMax: estimate.compareMax || 0,
      savingsMin: estimate.savingsMin || 0,
      savingsMax: estimate.savingsMax || 0,
    },
    rushFee
  )
  return {
    min: t.subtotalMin,
    max: t.subtotalMax,
    variable: t.subtotalMin !== t.subtotalMax,
    totalText: t.subtotalText,
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
  const dueMin = round2(total.min * factor)
  const dueMax = round2(total.max * factor)

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
    .map((l) => {
      const props = `${l.properties} ${l.properties === 1 ? 'property' : 'properties'}`
      const discount =
        l.discountPercent > 0
          ? ` — was ${l.compareRateText}, now ${l.rateText} (${l.discountPercent}% off)`
          : ` — ${l.rateText}`
      return `${l.name} — ${l.qty} ${unitLabel(l.unit, l.qty)} — ${props}${discount} — line total ${l.amountText}`
    })
    .join('\n')
}
