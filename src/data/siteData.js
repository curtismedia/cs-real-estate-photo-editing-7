// Global site settings — brand, navigation, contact details.
// This is the ONLY place contact information is defined. Header, Footer,
// Contact page, booking flow and every CTA read from here.

export const brand = {
  name: 'CS Real Estate Photo Editing',
  short: 'CS',
  tagline: 'Real Estate Post-Production Studio',
}

// Main navigation → real routes (multi-page)
export const nav = [
  { label: 'Work', to: '/work' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// Primary + secondary calls to action
export const cta = {
  primary: { label: 'Get 10 Free Edits', shortLabel: 'Free Test', to: '/free-test' },
  secondary: { label: 'Start a Project', to: '/book' },
  work: { label: 'View Our Work', to: '/work' },
  services: { label: 'Explore Our Services', to: '/services' },
}

// --- WhatsApp -------------------------------------------------------------
// wa.me requires the full international number with NO +, spaces or dashes.
const WHATSAPP_E164 = '84398648657'
const WHATSAPP_MESSAGE = 'Hi CS Real Estate Photo Editing, I’d like to discuss a project.'

export const contact = {
  email: 'curtisvisuals.sales@gmail.com',
  /** Display form of the phone number. */
  phone: '+84 398 648 657',
  /** tel: link target. */
  phoneHref: 'tel:+84398648657',
  whatsapp: '+84 398 648 657',
  whatsappNumber: WHATSAPP_E164,
  /** Opens a direct conversation with a prefilled message, desktop + mobile. */
  whatsappHref: `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  address: {
    lines: ['Capital Place', '29 Lieu Giai', 'Ba Dinh, Hanoi, Vietnam'],
    get full() {
      return this.lines.join(', ')
    },
  },
  hours: 'Mon–Sat · Rolling delivery, 7 days a week',
}

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/curtis.remedia/' },
  { label: 'WhatsApp', href: contact.whatsappHref },
]

