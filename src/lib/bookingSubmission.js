// ---------------------------------------------------------------------------
// Builds the payloads sent to Netlify Forms.
//
// Every value is a plain readable string — never a raw object — so the Netlify
// dashboard and the email notification are legible at a glance.
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
import {
  TOTAL_FREE_TEST_CREDITS,
  GROUP_A_CREDIT_COST,
  GROUP_B_CREDIT_COST,
  creditCostFor,
  freeTestGroupOf,
  freeTestCreditsUsed,
  freeTestCapacityPercent,
  groupAQuantity,
  groupBQuantity,
  isFreeTestEligible,
} from '../data/freeTestConfig'

const fullName = (details) =>
  [details.firstName, details.lastName].filter(Boolean).join(' ').trim()

const timestamp = () => new Date().toISOString()

/** "Estimated $130.00–$182.00 (range — final price to be confirmed)" or "$260.00" */
const rangeAwareAmount = (block, prefixEstimated = true) =>
  block.variable
    ? `${prefixEstimated ? 'Estimated ' : ''}${formatAmount(block.min, block.max)}${prefixEstimated ? ' (range — final price to be confirmed)' : ''}`
    : formatAmount(block.min, block.max)

/** Paid project booking → `project-booking` form. */
export function buildBookingPayload({ order, estimate, rushFee, total, payment }) {
  const { details, files, turnaround } = order
  const turnaroundType = TURNAROUND_TYPES[turnaround.type]

  const paymentLabel =
    payment.paymentOption === 'deposit' ? `${DEPOSIT_PERCENT}% Deposit` : 'Pay in Full — 100%'

  const dueText = total.variable ? `Estimated ${payment.dueText}` : payment.dueText

  const rushFeeAmountText = rushFee.hasFee
    ? rushFee.variable
      ? `Estimated ${rushFee.amountText}`
      : rushFee.amountText
    : '$0.00'

  return {
    'customer-name': fullName(details) || 'Not provided',
    'customer-email': details.email,
    company: details.company || 'Not provided',
    phone: details.phone,
    whatsapp: details.whatsapp,
    'project-type': 'Paid Project',
    promotion: PROMO.active ? PROMO.submissionLabel : 'None',
    services: formatServicesForSubmission(estimate),
    'file-link': files.link || 'Not provided',
    'reference-link': files.reference || 'Not provided',
    instructions: files.instructions || 'None provided',
    'turnaround-type': turnaroundType?.label || turnaround.type,
    'requested-turnaround-hours': `${turnaround.hours} hours`,
    'rush-fee-percent': rushFee.hasFee ? `+${rushFee.percent}%` : '0%',
    'rush-fee-amount': rushFeeAmountText,
    // Pre-sale figure, kept only so support can see what was discounted.
    'compare-subtotal': formatAmount(estimate.compareMin, estimate.compareMax),
    // The real, discounted service subtotal — everything below builds on this.
    'service-subtotal': rangeAwareAmount(estimate, false),
    'discount-savings': estimate.hasSavings
      ? `-${formatAmount(estimate.savingsMin, estimate.savingsMax)}`
      : '$0.00',
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

/** Free test request → `free-test-request` form. */
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

  const groupA = groupAQuantity(quantities)
  const groupB = groupBQuantity(quantities)
  const used = freeTestCreditsUsed(quantities)

  return {
    'customer-name': fullName(details) || 'Not provided',
    'customer-email': details.email,
    company: details.company || 'Not provided',
    phone: details.phone,
    whatsapp: details.whatsapp,
    'project-type': 'Free Test',
    services: serviceList,
    'group-a-quantity': `${groupA} ${groupA === 1 ? 'image' : 'images'} × ${GROUP_A_CREDIT_COST} credit = ${groupA * GROUP_A_CREDIT_COST} credits`,
    'group-b-quantity': `${groupB} ${groupB === 1 ? 'image' : 'images'} × ${GROUP_B_CREDIT_COST} credits = ${groupB * GROUP_B_CREDIT_COST} credits`,
    'total-test-images': String(groupA + groupB),
    'free-test-credits-used': `${used} / ${TOTAL_FREE_TEST_CREDITS}`,
    'free-test-capacity-used': `${freeTestCapacityPercent(quantities)}%`,
    'file-link': files.link || 'Not provided',
    'reference-link': files.reference || 'Not provided',
    instructions: files.instructions || 'None provided',
    'submitted-at': timestamp(),
  }
}
