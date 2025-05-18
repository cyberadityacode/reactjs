import React, { useEffect, useState } from 'react'

export default function CleanUpFunctionExample() {

    const [count, setCount] = useState(0);
    const stopCounter = 30;
    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((prev)=> {
                if(prev >= stopCounter){
                    clearInterval(interval);
                    return prev;
                }
                return prev+1;
            });
        },50);

        return ()=>clearInterval(interval);
    },[])

  return (
    <div>
        <h1>Auto Incremental Counter: {count}{count ===stopCounter && " +"} </h1>
    </div>
  )
}
