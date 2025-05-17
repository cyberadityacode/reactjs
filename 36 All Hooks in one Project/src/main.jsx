import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'

// import '../src/css/hooks.css'
import '../src/css/RegistrationReact.css'
// import App from './App.jsx'
import ChallengeUseState from '../components/hooks/useState/ChallengeUseState.jsx'
import RegistrationReact from '../components/hooks/useState/RegistrationReact.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <ChallengeUseState /> */}
    <RegistrationReact />
  </StrictMode> 
)
