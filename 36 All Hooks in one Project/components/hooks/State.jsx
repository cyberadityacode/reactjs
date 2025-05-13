import { useState } from "react";

export default function State() {

    const [count, setCount] = useState(0)

    const handleClickIncrement = (event)=>{
        console.log('Increment Clicked');
        setCount(count=> count+1)
        // setCount(prev=> prev+1)
        console.log(count);
    }

    const handleClickDecrement = () =>{
        console.log('Decrement ');
        setCount(count=> count-1);
        console.log(count);
    }

    const handleClickReset = () =>{
        console.log('Reset');
        setCount(0)
        console.log(count);
    }

  return (
    <div>
        <h1>State Hook - useState</h1>
        <div className="main-class" >
            <h1 className="text-center text-4xl">{count}</h1>
            <div className="m-4">
                <button className="bg-green-500 active:bg-green-800" onClick={handleClickIncrement}>Increment</button>
                <button className="bg-red-500 active:bg-red-800" onClick={handleClickDecrement}>Decrement</button>
                <button className="bg-gray-500 active:bg-gray-800" onClick={handleClickReset}>Reset</button>
            </div>
        </div>
    </div>
  )
}
