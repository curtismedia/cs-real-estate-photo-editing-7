import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import './styles/variables.css'
import './styles/reset.css'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* basename keeps every route ('/', '/work', '/services', …) correctly
        anchored under the GitHub Pages sub-path (e.g.
        /cs-real-estate-photo-editing-7/work). BASE_URL comes from vite.config.js
        `base`, so switching to a custom domain (`base: '/'`) needs no change
        here — basename becomes '/' automatically. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
