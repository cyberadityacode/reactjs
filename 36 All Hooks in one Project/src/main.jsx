import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'

// import '../src/css/hooks.css'
// import '../src/css/RegistrationReact.css'
// import '../src/css/challengeUseEffect.css'
// import '../src/css/howNotToFetchAPI.css'
// import App from './App.jsx'

import "../src/css/howNotToFetch.css";

import ChallengeUseState from "../components/hooks/useState/ChallengeUseState.jsx";
import RegistrationReact from "../components/hooks/useState/RegistrationReact.jsx";
import LoginReact from "../components/hooks/useState/LoginReact.jsx";
import ChallengeUseEffect from "../components/hooks/useEffect/ChallengeUseEffect.jsx";
import CleanUpFunctionExample from "../components/hooks/useEffect/CleanUpFunctionExample.jsx";
import HowNotToFetchAPI from "../components/hooks/useEffect/HowNotToFetchAPI.jsx";
import HowToFetchAPI from "../components/hooks/useEffect/HowToFetchAPI.jsx";
import UseRefFirstComponent from "../components/hooks/useRef/UseRefFirstComponent.jsx";
import UseRefSecondComponent from "../components/hooks/useRef/UseRefSecondComponent.jsx";
import UseRefThirdComponent from "../components/hooks/useRef/UseRefThirdComponent.jsx";
import UseRefFourthComponent from "../components/hooks/useRef/UseRefFourthComponent.jsx";
import UseRefFifthComponent from "../components/hooks/useRef/UseRefFifthComponent.jsx";
import ParentComponentFifth from "../components/hooks/useRef/UseRefFifthComponent.jsx";
import UseRefSixthComponent from "../components/hooks/useRef/UseRefSixthComponent.jsx";
import UseRefSeventhComponent from "../components/hooks/useRef/UseRefSeventhComponent.jsx";
import UseRefEighthComponent from "../components/hooks/useRef/UseRefEighthComponent.jsx";
import UseRefNinthComponent from "../components/hooks/useRef/UseRefNinthComponent.jsx";
import UseIdLessonOne from "../components/hooks/useId/UseIdLessonOne.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    {/* <ChallengeUseState /> */}
    {/* <RegistrationReact /> */}
    {/* <LoginReact /> */}
    {/* <ChallengeUseEffect /> */}
    {/* <CleanUpFunctionExample /> */}
    {/* <HowNotToFetchAPI /> */}
    {/* <HowToFetchAPI /> */}
    {/* <UseRefFirstComponent /> */}
    {/* <UseRefSecondComponent /> */}
    {/* <UseRefThirdComponent /> */}
    {/* <UseRefFourthComponent /> */}
    {/* <UseRefFifthComponent /> <ParentComponentFifth /> */}
    {/* <UseRefSixthComponent /> */}
    {/* <UseRefSeventhComponent /> */}
  {/*   <UseRefEighthComponent />
    <UseRefNinthComponent /> */}
    <UseIdLessonOne />
  </StrictMode>
);
