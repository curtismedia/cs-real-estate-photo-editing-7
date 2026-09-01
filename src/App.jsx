import { useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import SaleBanner from './components/SaleBanner/SaleBanner'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Work from './pages/Work/Work'
import Services from './pages/Services/Services'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import FreeTest from './pages/FreeTest/FreeTest'
import Booking from './pages/Booking/Booking'

// Routes that use the minimal wizard header (no global Header/Footer)
const BARE_ROUTES = ['/free-test', '/book']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <section className="page-intro" style={{ minHeight: '60vh' }}>
      <div className="container">
        <span className="label">404</span>
        <h1 className="display page-intro__title">Page not found.</h1>
        <Link to="/" className="btn">Back to home <span className="arrow" aria-hidden="true">→</span></Link>
      </div>
    </section>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const bare = BARE_ROUTES.includes(pathname)

  return (
    <>
      <ScrollToTop />
      {/* Above the header on every route, wizard routes included, so the
          countdown is one shared component with one shared clock. */}
      <SaleBanner />
      {!bare && <Header />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/free-test" element={<FreeTest />} />
          <Route path="/book" element={<Booking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!bare && <Footer />}
    </>
  )
}
