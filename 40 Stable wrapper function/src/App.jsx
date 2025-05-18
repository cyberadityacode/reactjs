import React, { useState } from 'react'

export default function App() {
  const [count,setCount] = useState(0);
  const [message, setMessage] = useState("");
  const handleIncrementWithoutArgs = ()=> {
    setCount((prev)=> prev+1);
  } 

  const handleGreeting = (greet, value)=>{
    console.log(greet, value);
    setMessage(greet +" " + value);
  
  }

  const handleIncrementWithArgs =()=> handleGreeting("Hello", count);

  return (
    <div>
      <h1>Stable Wrapper function with/without arguments </h1>
      <h1>Count: {count} and Message: {message}</h1>
      <button onClick={handleIncrementWithoutArgs}>Without Argument</button>
      <button onClick = {handleIncrementWithArgs}>With Arguments</button>
    </div>
  )
}
