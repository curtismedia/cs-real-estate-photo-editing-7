import { useSEO } from '../../hooks/useSEO'
import { BookingProvider } from '../../context/BookingContext'
import BookingWizard from '../../components/booking/BookingWizard'
import WizardHeader from '../../components/booking/WizardHeader'

export default function FreeTest() {
  useSEO({
    title: 'Get 10 Free Edits | CS Real Estate Photo Editing',
    description: 'Send up to 10 images and we will edit them free — see the quality on your own photos before you order.',
  })
  return (
    <BookingProvider initialMode="free-test">
      <WizardHeader />
      <BookingWizard />
    </BookingProvider>
  )
}
