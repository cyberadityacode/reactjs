
// import './App.css'

function App() {
  
  const handleButtonClick = (event)=>{
    alert('Hi I am on Click Event')
    console.log(event);
  }

  const handleWelcomeUser = (user)=>{
    console.log('Welcome ' , user);
  }

  return (
    <>
      <h1 className='aditya-class'>33 Event Handling in React in Detail</h1>

      {/* 
        Remember, if you call this function here () then it will run
        without even clicking. Pass the reference and Don't call here. with this you get default synthetic base event

        But, Fat arrow function needs calling () with parenthesis, you need to pass synthetic event object in the argument
      */}
        <button className="p-3 bg-red-500 focus:scale-105" onClick={handleButtonClick} >Click - function component with named function</button>
        {/* 
          In react, event handlers receive the event Object as an argument by default.
          However, when you use an arrow function directly in the onClick attribute without passing the event explicitly,
          react doesn't pass the event object to your handler function.
          since, arrow function creates a new function and calls your handler
          without passing any arguments.
        */}
        {/*
          with fat arrow function you get pointerEvent Object only if you supply event object to the calling argument not in the pre arrow args ()=>
        */}
        <button className="p-3 bg-green-500 focus:scale-105" onClick={(event)=>handleButtonClick(event)} >Click - function component with fat arrow function</button>

        {/* Inline Event Handler */}
        <button className="p-3 bg-blue-500 focus:scale-105" onClick={(event)=>console.log(event)} >Inline Event Handler</button>

        {/* Function Components with Inline Arrow Functions */}
        <button className="p-3 bg-gray-500 focus:scale-105" onClick={()=>console.log("hi")} >Functions Components with Inline Event Handler</button>

        {/* Passing arguments to Event Handlers */}
        <button className="p-3 bg-yellow-500 focus:scale-105" onClick={()=>handleWelcomeUser("aditya")} >Passing argument to Inline Event Handler</button>

    </>
  )
}

export default App
