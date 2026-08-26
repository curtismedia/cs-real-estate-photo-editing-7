// ---------------------------------------------------------------------------
// FREE TEST RULES — single source of truth for what can be tested for free,
// and how much of it.
//
// The Free Test is a WEIGHTED CREDIT budget, not a flat image count:
//
//   TOTAL_FREE_TEST_CREDITS = 10
//
//   GROUP A (standard)  1 image = 1 credit   -> 10 images fills the test
//   GROUP B (advanced)  1 image = 5 credits  ->  2 images fills the test
//
// The 10 credits are ONE shared pool across every selected service. There is
// no per-service cap: "Object Removal 1 + Day to Dusk 1" is already 10/10 and
// nothing else can be added.
//
// Every place that needs to know a Free Test rule (StepServices,
// BookingContext, StepReview, Netlify submission) reads from here, so the
// limits can never drift out of sync between components.
// ---------------------------------------------------------------------------

/** The whole Free Test budget, expressed in credits. */
export const TOTAL_FREE_TEST_CREDITS = 10

/** Credit cost of a single image, per group. */
export const GROUP_A_CREDIT_COST = 1
export const GROUP_B_CREDIT_COST = 5

/** GROUP A — standard test services. 1 image = 1 credit. */
export const FREE_TEST_GROUP_A_SERVICES = ['hdr', 'drone-aerial', 'single']

/** GROUP B — advanced test services. 1 image = 5 credits. */
export const FREE_TEST_GROUP_B_SERVICES = [
  'object-removal',
  'flambient',
  'twilight',
  'day-to-dusk',
]

/** Not offered as a free test at all — paid projects only. */
export const FREE_TEST_EXCLUDED_SERVICES = ['video-editing', 'floor-plan', 'virtual-staging']

export const isFreeTestGroupA = (slug) => FREE_TEST_GROUP_A_SERVICES.includes(slug)
export const isFreeTestGroupB = (slug) => FREE_TEST_GROUP_B_SERVICES.includes(slug)
export const isFreeTestExcluded = (slug) => FREE_TEST_EXCLUDED_SERVICES.includes(slug)
export const isFreeTestEligible = (slug) => isFreeTestGroupA(slug) || isFreeTestGroupB(slug)

/** 'A' | 'B' | null */
export const freeTestGroupOf = (slug) =>
  isFreeTestGroupA(slug) ? 'A' : isFreeTestGroupB(slug) ? 'B' : null

/** Credit cost of ONE image of this service. 0 = not testable. */
export function creditCostFor(slug) {
  if (isFreeTestGroupA(slug)) return GROUP_A_CREDIT_COST
  if (isFreeTestGroupB(slug)) return GROUP_B_CREDIT_COST
  return 0
}

const qtyOf = (quantities, slug) => Math.max(0, Math.floor(Number(quantities?.[slug]?.qty) || 0))

/** Total images selected across Group A. */
export function groupAQuantity(quantities = {}) {
  return FREE_TEST_GROUP_A_SERVICES.reduce((sum, slug) => sum + qtyOf(quantities, slug), 0)
}

/** Total images selected across Group B. */
export function groupBQuantity(quantities = {}) {
  return FREE_TEST_GROUP_B_SERVICES.reduce((sum, slug) => sum + qtyOf(quantities, slug), 0)
}

/**
 * usedCredits = groupAQuantity * 1 + groupBQuantity * 5
 * Derived live from the actual quantities — never stored, so it can never
 * fall out of sync with what the customer has selected.
 */
export function freeTestCreditsUsed(quantities = {}) {
  return (
    groupAQuantity(quantities) * GROUP_A_CREDIT_COST +
    groupBQuantity(quantities) * GROUP_B_CREDIT_COST
  )
}

/** Credits still available. */
export function freeTestCreditsRemaining(quantities = {}) {
  return Math.max(0, TOTAL_FREE_TEST_CREDITS - freeTestCreditsUsed(quantities))
}

/** Percentage of the Free Test capacity currently used (0-100, rounded). */
export function freeTestCapacityPercent(quantities = {}) {
  return Math.round((freeTestCreditsUsed(quantities) / TOTAL_FREE_TEST_CREDITS) * 100)
}

/** Credits currently spent by one service alone. */
export function creditsForService(slug, quantities = {}) {
  return qtyOf(quantities, slug) * creditCostFor(slug)
}

/**
 * The highest quantity this service may be set to right now, given everything
 * else already selected. Its own current quantity is credited back first, so
 * the field can always be lowered and re-raised within its own slice.
 */
export function freeTestMaxQtyFor(slug, quantities = {}) {
  const cost = creditCostFor(slug)
  if (cost === 0) return 0
  const otherCredits = freeTestCreditsUsed(quantities) - creditsForService(slug, quantities)
  const room = Math.max(0, TOTAL_FREE_TEST_CREDITS - otherCredits)
  return Math.floor(room / cost)
}

/** Can one more image of this service be afforded right now? */
export function canAddFreeTestImage(slug, quantities = {}) {
  const cost = creditCostFor(slug)
  if (cost === 0) return false
  return freeTestCreditsRemaining(quantities) >= cost
}

/**
 * Rebuild `services` + `quantities` so the whole selection respects the
 * weighted budget: excluded services dropped, and every remaining service
 * clamped in selection order so the running credit total never passes 10.
 * Used when switching INTO Free Test and as a final guard on every update.
 */
export function clampToFreeTestRules(services = [], quantities = {}, properties = 1) {
  const nextQuantities = {}
  const nextServices = []
  let usedCredits = 0

  for (const slug of services) {
    if (!isFreeTestEligible(slug)) continue

    const cost = creditCostFor(slug)
    const room = Math.max(0, TOTAL_FREE_TEST_CREDITS - usedCredits)
    const affordable = Math.floor(room / cost)
    if (affordable < 1) continue

    const wanted = qtyOf(quantities, slug) || 1
    const qty = Math.min(wanted, affordable)

    nextQuantities[slug] = { qty, properties }
    nextServices.push(slug)
    usedCredits += qty * cost
  }

  return { services: nextServices, quantities: nextQuantities }
}

/** Human-readable cost label for a service card. */
export const creditLabelFor = (slug) => {
  const cost = creditCostFor(slug)
  if (!cost) return ''
  return cost === 1 ? '1 image = 1 test credit' : `1 image = ${cost} test credits`
}
