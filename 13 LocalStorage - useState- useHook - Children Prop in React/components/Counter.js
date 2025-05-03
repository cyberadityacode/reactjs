import React, { useEffect } from 'react'

export default function Counter({countAnyValue}) {
    // store this value in localStorage
    console.log(typeof countAnyValue);
          
    console.log('----',countAnyValue.toString());
    // This ensures it only updates when countValue changes — not on every render.
    useEffect(()=>{
        localStorage.setItem('countValue',(countAnyValue))
    }, [countAnyValue])


  return (
    <div>Counter {countAnyValue}</div>
  )
}
