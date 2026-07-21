import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ghost Console Log
console.log(
  "%c🔥 Engineered & Designed by Designer @NEET",
  "background: linear-gradient(135deg, #0f0f0f, #1a1a1a); color: #e0e0e0; font-size: 14px; font-family: monospace; padding: 12px 20px; border-left: 4px solid #ff4b2b; border-radius: 6px; text-shadow: 0 0 10px rgba(255,100,100,0.2); letter-spacing: 1px;"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
