import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'

import '../src/css/hooks.css'
// import App from './App.jsx'
import ChallengeUseState from '../components/hooks/useState/ChallengeUseState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <ChallengeUseState />
  </StrictMode> 
)
