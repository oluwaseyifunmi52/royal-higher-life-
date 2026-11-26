import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import AuthProvider from './context/AuthContext.jsx'
import './fontLoader.js'
import heroPhoto from './assets/royal4.jpeg'
import heroPhotoSmall from './assets/royal4-600.jpg'

if (window.location.pathname === '/') {
  const heroPreload = document.createElement('link')
  heroPreload.rel = 'preload'
  heroPreload.as = 'image'
  heroPreload.href = heroPhotoSmall
  heroPreload.setAttribute('imagesrcset', `${heroPhotoSmall} 600w, ${heroPhoto} 1080w`)
  heroPreload.setAttribute('imagesizes', '(max-width: 767px) 100vw, 58vw')
  heroPreload.fetchPriority = 'high'
  document.head.append(heroPreload)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
