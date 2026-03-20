import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ObjectVoiceApp from './ObjectVoiceApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ObjectVoiceApp />
  </StrictMode>,
)
