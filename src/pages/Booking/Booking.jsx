import { useSEO } from '../../hooks/useSEO'
import { BookingProvider } from '../../context/BookingContext'
import BookingWizard from '../../components/booking/BookingWizard'
import WizardHeader from '../../components/booking/WizardHeader'

export default function Booking() {
  useSEO({
    title: 'Start a Project | CS Real Estate Photo Editing',
    description: 'Build a real estate photo and video editing order — select services, send files and get a live estimate.',
  })
  return (
    <BookingProvider initialMode="book">
      <WizardHeader />
      <BookingWizard />
    </BookingProvider>
  )
}
