import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'

// import '../src/css/hooks.css'
// import '../src/css/RegistrationReact.css'
import '../src/css/challengeUseEffect.css'
// import App from './App.jsx'
import ChallengeUseState from '../components/hooks/useState/ChallengeUseState.jsx'
import RegistrationReact from '../components/hooks/useState/RegistrationReact.jsx'
import LoginReact from '../components/hooks/useState/LoginReact.jsx'
import ChallengeUseEffect from '../components/hooks/useEffect/ChallengeUseEffect.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <ChallengeUseState /> */}
    {/* <RegistrationReact /> */}
    {/* <LoginReact /> */}
    <ChallengeUseEffect />
  </StrictMode> 
)
