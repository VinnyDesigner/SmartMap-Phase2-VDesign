import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './setupLeaflet.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
