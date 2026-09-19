// ---------------------------------------------------------------------------
// Builds the payloads sent to the form backend (see src/lib/formSubmission.js
// — currently a Google Apps Script that appends rows to a Google Sheet).
//
// Every value is a plain readable string — never a raw object — so the
// resulting spreadsheet row is legible at a glance.
// ---------------------------------------------------------------------------

import {
  formatServicesForSubmission,
  formatAmount,
  DEPOSIT_PERCENT,
  TURNAROUND_TYPES,
  PROMO,
} from '../data/pricing'
import { getServiceName } from '../data/services'
import { POLICY_ACCEPT_LABEL } from '../data/policies'
import { creditCostFor, freeTestGroupOf, isFreeTestEligible } from '../data/freeTestConfig'

const fullName = (details) =>
  [details.firstName, details.lastName].filter(Boolean).join(' ').trim()

const timestamp = () => new Date().toISOString()

/** "Estimated $130.00–$182.00 (range — final price to be confirmed)" or "$260.00" */
const rangeAwareAmount = (block, prefixEstimated = true) =>
  block.variable
    ? `${prefixEstimated ? 'Estimated ' : ''}${formatAmount(block.min, block.max)}${prefixEstimated ? ' (range — final price to be confirmed)' : ''}`
    : formatAmount(block.min, block.max)

/**
 * Paid project booking → `project-booking` form.
 *
 * Trimmed to the columns actually used day-to-day: the detailed price
 * breakdown (compare price, per-service subtotal, savings, rush-fee
 * breakdown) is still computed elsewhere in the app (shown to the customer
 * in the review step) but intentionally left out of the spreadsheet — only
 * the final payable amount, turnaround and payment method are recorded here.
 */
export function buildBookingPayload({ order, estimate, total, payment }) {
  const { details, files, turnaround } = order
  const turnaroundType = TURNAROUND_TYPES[turnaround.type]

  const paymentLabel =
    payment.paymentOption === 'deposit' ? `${DEPOSIT_PERCENT}% Deposit` : 'Pay in Full — 100%'

  const dueText = total.variable ? `Estimated ${payment.dueText}` : payment.dueText

  return {
    'customer-name': fullName(details) || 'Not provided',
    'customer-email': details.email,
    company: details.company || 'Not provided',
    phone: details.phone,
    'project-type': 'Paid Project',
    promotion: PROMO.active ? PROMO.submissionLabel : 'None',
    services: formatServicesForSubmission(estimate),
    'file-link': files.link || 'Not provided',
    'reference-link': files.reference || 'Not provided',
    instructions: files.instructions || 'None provided',
    'turnaround-type': turnaroundType?.label || turnaround.type,
    'requested-turnaround-hours': `${turnaround.hours} hours`,
    // The final amount the customer pays — the price breakdown behind it
    // (compare price, subtotal, savings, rush fee) is intentionally omitted.
    'estimated-total': rangeAwareAmount(total),
    'payment-option': paymentLabel,
    'amount-due': dueText,
    'remaining-balance': payment.isDeposit
      ? total.variable
        ? `Estimated ${payment.remainingText}`
        : payment.remainingText
      : 'None — paying in full',
    'policy-accepted': order.consent.policy ? `Yes — ${POLICY_ACCEPT_LABEL}` : 'No',
    'submitted-at': timestamp(),
  }
}

/**
 * Free test request → `free-test-request` form.
 *
 * Trimmed to just the services line — the per-group image quantities and
 * credit-usage math (still shown to the customer in the review step) are
 * intentionally left out of the spreadsheet.
 */
export function buildFreeTestPayload({ order }) {
  const { details, files, quantities } = order

  // Only ever submit services that are actually valid for a free test, using
  // the live quantities — never a paid-only service, never a stale number,
  // and never a raw object.
  const testedServices = order.services.filter(isFreeTestEligible)

  const line = (slug) => {
    const qty = Math.max(0, Number(quantities[slug]?.qty) || 0)
    const credits = qty * creditCostFor(slug)
    const group = freeTestGroupOf(slug)
    return `${getServiceName(slug)}: ${qty} ${qty === 1 ? 'image' : 'images'} (Group ${group} — ${credits} credits)`
  }

  const serviceList = testedServices.length
    ? testedServices.map(line).join('\n')
    : 'None selected'

  return {
    'customer-name': fullName(details) || 'Not provided',
    'customer-email': details.email,
    company: details.company || 'Not provided',
    phone: details.phone,
    'project-type': 'Free Test',
    services: serviceList,
    'file-link': files.link || 'Not provided',
    'reference-link': files.reference || 'Not provided',
    instructions: files.instructions || 'None provided',
    'submitted-at': timestamp(),
  }
}
