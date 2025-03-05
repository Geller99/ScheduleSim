import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ScheduleSim from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <ScheduleSim/>
  </StrictMode>,
)
