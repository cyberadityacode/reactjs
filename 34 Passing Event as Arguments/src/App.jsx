import EventProps from "../components/EventProps"

function App() {

  return (
    <>
      <h1 className='bg-red-500 text-3xl'>34 Passing Event as an Argument</h1>
      <p> to allow child component to communicate with parent components</p>
      <ol className="text-xl m-7 list-decimal text-justify">
        <li>form handling - passing event handlers like onChange, onSubmit
          to form components allows the child components to update the form data 
          and notify the parent components of the changes.
        </li>
        <li className="">
          User Interactions: button click to open models or navigating to different pages
        </li>
        <li>State Management: Update state in parent components, which can 
          be passed down to child components as a props to reflect the updated state.
        </li>
        <li>Callback functions: event handlers can be used as callback function to handle
          asynchronous operations or to update state based on the result of operations.
        </li>
      </ol>

      <EventProps />
    </>
  )
}

export default App
