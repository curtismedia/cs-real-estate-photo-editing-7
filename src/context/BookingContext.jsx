import { createContext, useContext, useMemo, useState } from 'react'
import {
  calculateEstimate,
  calculateRushFee,
  calculateProjectTotal,
  calculatePayment,
  getServiceRate,
  getTurnaround,
} from '../data/pricing'
import {
  TOTAL_FREE_TEST_CREDITS,
  clampToFreeTestRules,
  isFreeTestEligible,
  creditCostFor,
  freeTestCreditsUsed,
  freeTestCreditsRemaining,
  freeTestCapacityPercent,
  freeTestMaxQtyFor,
  canAddFreeTestImage,
  groupAQuantity,
  groupBQuantity,
} from '../data/freeTestConfig'

const BookingContext = createContext(null)

const DEFAULT_PROPERTIES = 1
const DEFAULT_TURNAROUND = { type: 'standard', hours: 12 }

const initialOrder = {
  /** 'free-test' | 'book' — chosen in Step 1, switchable at any time from there. */
  projectType: 'book',
  /** Selected service slugs. */
  services: [],
  /** Per-service quantity: { hdr: { qty: 25, properties: 1 } } */
  quantities: {},
  files: { link: '', instructions: '', reference: '' },
  /** Requested turnaround — Paid Project only; unused (but harmless) in Free Test. */
  turnaround: DEFAULT_TURNAROUND,
  details: { firstName: '', lastName: '', phone: '', email: '', company: '' },
  /** 'full' = pay in full, 'deposit' = 50% deposit. */
  paymentOption: 'full',
  consent: { policy: false },
}

/** Seed a sensible starting quantity for a newly-selected service. */
const seedQuantity = (slug, freeTest) => {
  if (freeTest) return { qty: 1, properties: DEFAULT_PROPERTIES }
  const rate = getServiceRate(slug)
  const qty = rate?.unit === 'image' ? 25 : 1
  return { qty, properties: DEFAULT_PROPERTIES }
}

export function BookingProvider({ initialMode = 'book', children }) {
  const [order, setOrder] = useState(() => ({ ...initialOrder, projectType: initialMode }))
  const [step, setStep] = useState(0)
  /** 'idle' | 'submitting' | 'error' | 'success' */
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const freeTest = order.projectType === 'free-test'

  const update = (patch) => setOrder((o) => ({ ...o, ...patch }))
  const updateNested = (key, patch) =>
    setOrder((o) => ({ ...o, [key]: { ...o[key], ...patch } }))

  /**
   * Step 1 — switch between Free Test and Paid Project. Clears / clamps
   * whatever the new mode can't carry over, so nothing stale ever reaches
   * the review step or the Netlify submission.
   */
  const setProjectType = (type) =>
    setOrder((o) => {
      if (o.projectType === type) return o

      if (type === 'free-test') {
        // Drop paid-only services, then clamp what's left to the 10-credit
        // weighted budget. Turnaround / rush / payment don't apply to a test.
        const { services, quantities } = clampToFreeTestRules(
          o.services,
          o.quantities,
          DEFAULT_PROPERTIES
        )
        return {
          ...o,
          projectType: type,
          services,
          quantities,
          turnaround: DEFAULT_TURNAROUND,
          paymentOption: 'full',
        }
      }

      // Back to Paid Project — no credit restrictions apply any more, and the
      // Free Test quantities (1s and 2s) are meaningless here, so every
      // surviving service is reseeded with its normal paid default.
      const quantities = {}
      for (const slug of o.services) quantities[slug] = seedQuantity(slug, false)

      return {
        ...o,
        projectType: type,
        quantities,
        turnaround: DEFAULT_TURNAROUND,
      }
    })

  /** Selecting a service seeds its own quantity + property count. */
  const toggleService = (slug) =>
    setOrder((o) => {
      const isFreeTest = o.projectType === 'free-test'
      const isSelected = o.services.includes(slug)

      if (isSelected) {
        const { [slug]: _removed, ...rest } = o.quantities
        return { ...o, services: o.services.filter((s) => s !== slug), quantities: rest }
      }

      if (isFreeTest) {
        // Only testable services, and only if the first image is affordable —
        // selecting a 5-credit service with 3 credits left must be impossible.
        if (!isFreeTestEligible(slug)) return o
        if (!canAddFreeTestImage(slug, o.quantities)) return o
        return {
          ...o,
          services: [...o.services, slug],
          quantities: { ...o.quantities, [slug]: { qty: 1, properties: DEFAULT_PROPERTIES } },
        }
      }

      return {
        ...o,
        services: [...o.services, slug],
        quantities: { ...o.quantities, [slug]: o.quantities[slug] ?? seedQuantity(slug, false) },
      }
    })

  /**
   * Update one field ('qty' | 'properties') of one service's quantity block.
   *
   * In Free Test mode this is the ONLY gate that matters: the requested value
   * is clamped against the credits actually left in the CURRENT state (`o`),
   * not against a value captured at render time. Rapid clicking, touch
   * double-fires, React batching, stale closures and programmatic calls all
   * funnel through here, so a state where usedCredits > 10 can never exist —
   * not even for a single render.
   */
  const setQuantity = (slug, field, n) =>
    setOrder((o) => {
      const isFreeTest = o.projectType === 'free-test'
      const floor = field === 'properties' ? 1 : 0
      let val = Number.isFinite(n) ? Math.max(floor, Math.round(n)) : floor

      if (isFreeTest && field === 'qty') {
        if (creditCostFor(slug) === 0) return o
        val = Math.min(val, freeTestMaxQtyFor(slug, o.quantities))
      }

      const current = o.quantities[slug] || seedQuantity(slug, isFreeTest)
      const next = { ...o, quantities: { ...o.quantities, [slug]: { ...current, [field]: val } } }

      // Final belt-and-braces guard: if anything ever produced an over-budget
      // combination, reject the update entirely rather than store it.
      if (isFreeTest && freeTestCreditsUsed(next.quantities) > TOTAL_FREE_TEST_CREDITS) return o

      return next
    })

  const setTurnaroundType = (type) =>
    setOrder((o) => {
      const t = getTurnaround(type)
      return { ...o, turnaround: { type, hours: t?.defaultHours ?? o.turnaround.hours } }
    })

  const setTurnaroundHours = (hours) =>
    setOrder((o) => ({
      ...o,
      turnaround: { ...o.turnaround, hours: Number.isFinite(hours) ? hours : '' },
    }))

  const estimate = useMemo(
    () => calculateEstimate({ ...order, freeTest }),
    [order, freeTest]
  )

  const rushFee = useMemo(
    () => calculateRushFee(estimate, order.turnaround),
    [estimate, order.turnaround]
  )

  const total = useMemo(
    () => calculateProjectTotal(estimate, rushFee),
    [estimate, rushFee]
  )

  const payment = useMemo(
    () => calculatePayment(total, order.paymentOption),
    [total, order.paymentOption]
  )

  // ---- Free Test derived state — all computed from order.quantities, the
  // single source of truth. Nothing about the budget is stored separately.
  const freeTestCredits = useMemo(
    () => ({
      total: TOTAL_FREE_TEST_CREDITS,
      used: freeTestCreditsUsed(order.quantities),
      remaining: freeTestCreditsRemaining(order.quantities),
      percent: freeTestCapacityPercent(order.quantities),
      groupA: groupAQuantity(order.quantities),
      groupB: groupBQuantity(order.quantities),
    }),
    [order.quantities]
  )

  /** Can one more image of this service be afforded right now? */
  const canAddImage = (slug) => canAddFreeTestImage(slug, order.quantities)
  /** Highest quantity this service may currently be set to. */
  const maxQtyFor = (slug) => freeTestMaxQtyFor(slug, order.quantities)

  const value = {
    freeTest,
    order,
    step,
    setStep,
    status,
    setStatus,
    errorMessage,
    setErrorMessage,
    submitted: status === 'success',
    update,
    updateNested,
    setProjectType,
    toggleService,
    setQuantity,
    setTurnaroundType,
    setTurnaroundHours,
    estimate,
    rushFee,
    total,
    payment,
    freeTestCredits,
    canAddImage,
    maxQtyFor,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
