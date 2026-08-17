import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './setupLeaflet.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
