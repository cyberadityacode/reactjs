import DerivedState from "../components/hooks/DerivedState";
import State from "../components/hooks/State"
import LiftStateUp from "../components/LiftStateUp";

function App() {


  return (
  <>
    <div className="bg-amber-800 " >Welcome to APP</div>
    <State />

    <SiblingComponent />
    <DerivedState />

    <LiftStateUp />
  </>
  )
}

export default App


export function SiblingComponent(){
    console.log("Sibling Component Renders");
    return (
        <div>Sibling Component </div>
    )
}
