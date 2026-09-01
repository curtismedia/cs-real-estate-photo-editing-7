import { Link } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import SummaryBar from './SummaryBar'
import StepProjectType from './StepProjectType'
import StepServices from './StepServices'
import StepFiles from './StepFiles'
import StepTurnaround from './StepTurnaround'
import StepDetails from './StepDetails'
import StepReview from './StepReview'
import StepPolicy from './StepPolicy'
import { submitToNetlify, FORM_NAMES } from '../../lib/netlifyForms'
import { buildBookingPayload, buildFreeTestPayload } from '../../lib/bookingSubmission'
import { isValidTurnaroundHours } from '../../data/pricing'
import { detailsValid } from '../../lib/validation'
import {
  TOTAL_FREE_TEST_CREDITS,
  isFreeTestEligible,
  freeTestCreditsUsed,
} from '../../data/freeTestConfig'
import './booking.css'

const allSteps = [
  { key: 'type', label: 'Project Type', title: 'Choose your project type.', Comp: StepProjectType },
  { key: 'services', label: 'Services', title: 'Build your project.', Comp: StepServices },
  { key: 'files', label: 'Files', title: 'Send us your files.', Comp: StepFiles },
  { key: 'turnaround', label: 'Turnaround', title: 'How fast do you need it?', Comp: StepTurnaround },
  { key: 'details', label: 'Your details', title: 'Where should we reach you?', Comp: StepDetails },
  { key: 'review', label: 'Review', title: 'Review your project.', Comp: StepReview },
  { key: 'policy', label: 'Confirm', title: 'A few confirmations.', Comp: StepPolicy },
]

export default function BookingWizard() {
  const {
    step, setStep, order, freeTest, estimate, rushFee, total: orderTotal, payment,
    status, setStatus, errorMessage, setErrorMessage, submitted,
  } = useBooking()

  // Turnaround / rush pricing only applies to a Paid Project — Free Test skips it.
  const steps = freeTest ? allSteps.filter((s) => s.key !== 'turnaround') : allSteps

  if (submitted) {
    return (
      <div className="wizard">
        <div className="container">
          <div className="confirm">
            <span className="label">Request received</span>
            <h1 className="display confirm__title">
              {freeTest ? 'Thank you.' : 'Your project request has been received.'}
            </h1>
            {freeTest ? (
              <div className="confirm__text">
                <p>We’ve received your free test request and your images.</p>
                <p>We’ll review your files and editing notes and get your edits back to you shortly.</p>
                <p>Please check your inbox and spam/junk folder for our reply.</p>
              </div>
            ) : (
              <div className="confirm__text">
                <p>We’ll review your files, editing requirements, requested turnaround and final project scope.</p>
                <p>Once your project is confirmed, payment instructions will be sent to the email address you provided.</p>
                <p>Please check your inbox and spam/junk folder for our confirmation.</p>
              </div>
            )}
            <div>
              <Link to="/" className="btn">Back to home <span className="arrow" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const current = steps[step]
  const isLast = step === steps.length - 1
  const totalSteps = steps.length
  const submitting = status === 'submitting'

  // Per-step validation gates
  const canContinue = (() => {
    if (submitting) return false
    if (current.key === 'type') {
      return order.projectType === 'free-test' || order.projectType === 'book'
    }
    if (current.key === 'services') {
      if (order.services.length === 0) return false
      if (freeTest) {
        // Every selection must be a real test service with at least one image,
        // and the weighted credit budget must not be exceeded. This validates
        // the actual quantities rather than trusting the disabled buttons.
        const used = freeTestCreditsUsed(order.quantities)
        return (
          used > 0 &&
          used <= TOTAL_FREE_TEST_CREDITS &&
          order.services.every(
            (s) => isFreeTestEligible(s) && (order.quantities[s]?.qty ?? 0) > 0
          )
        )
      }
      return order.services.every(
        (s) => (order.quantities[s]?.qty ?? 0) > 0 && (order.quantities[s]?.properties ?? 0) > 0
      )
    }
    if (current.key === 'turnaround') {
      return isValidTurnaroundHours(order.turnaround.type, order.turnaround.hours)
    }
    if (current.key === 'details') {
      // Name, email, phone AND WhatsApp — same rules the inline errors use.
      return detailsValid(order.details)
    }
    // Final submit re-checks the details too: a customer can walk back to
    // Step 5, clear a field and jump forward again via Back/Continue.
    if (isLast) return order.consent.policy && detailsValid(order.details)
    return true
  })()

  const submit = async () => {
    // Last line of defence — never POST an order missing required contact info.
    if (!detailsValid(order.details)) {
      setErrorMessage('Please complete your name, email, phone and WhatsApp before submitting.')
      setStatus('error')
      setStep(steps.findIndex((s) => s.key === 'details'))
      window.scrollTo({ top: 0 })
      return
    }
    setStatus('submitting')
    setErrorMessage('')
    try {
      const formName = freeTest ? FORM_NAMES.freeTest : FORM_NAMES.booking
      const payload = freeTest
        ? buildFreeTestPayload({ order })
        : buildBookingPayload({ order, estimate, rushFee, total: orderTotal, payment })

      await submitToNetlify(formName, payload)

      // Only now is it true — the customer's data is safely stored.
      setStatus('success')
      window.scrollTo({ top: 0 })
    } catch (err) {
      // Keep every entered value so the customer can simply retry.
      setErrorMessage(err?.message || 'Network error.')
      setStatus('error')
    }
  }

  const next = () => {
    if (isLast) { submit(); return }
    // Clamp in case switching project type on Step 1 shortened the step list
    // while we were further along (defensive — normally unreachable since
    // project type can only change while step === 0).
    setStep(Math.min(step + 1, steps.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const back = () => {
    setStep(Math.max(0, step - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const Comp = current.Comp
  const nextLabel = submitting
    ? 'Sending…'
    : isLast
      ? (freeTest ? 'Submit free test' : 'Submit request')
      : 'Continue'
  // Narrow phones get a shorter word so the button never has to be clipped
  // or shrunk below a comfortable tap target.
  const nextLabelShort = submitting ? 'Sending…' : isLast ? 'Submit' : 'Continue'

  return (
    <div className="wizard">
      <div className="container wizard__inner">
        <div className="wizard__progress">
          <span className="label">Step {step + 1} of {totalSteps} · {current.label}</span>
          <div className="wizard__progress-bar">
            <div className="wizard__progress-fill" style={{ transform: `scaleX(${(step + 1) / totalSteps})` }} />
          </div>
        </div>

        <h1 className="h1 wizard__step-title">{current.title}</h1>

        <Comp />
      </div>

      <SummaryBar
        onBack={back}
        onNext={next}
        canBack={step > 0 && !submitting}
        canNext={canContinue}
        nextLabel={nextLabel}
        nextLabelShort={nextLabelShort}
      />
    </div>
  )
}
