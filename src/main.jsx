import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './setupLeaflet.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import './index.css'

// Filter out upstream Three.js v0.185 internal Clock deprecation warning caused by @react-three/fiber
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
    return;
  }
  originalWarn.apply(console, args);
};
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ProjectProvider } from './contexts/ProjectContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)

