import State from "../components/hooks/State"

function App() {


  return (
  <>
    <div className="bg-amber-800 " >Welcome to APP</div>
    <State />

    <SiblingComponent />
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
