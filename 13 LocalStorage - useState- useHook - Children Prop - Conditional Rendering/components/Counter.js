import React, { useEffect } from 'react'

export default function Counter({countAnyValue}) {
    // store this value in localStorage
    console.log(typeof countAnyValue);
          
    console.log('----',countAnyValue.toString());
    // This ensures it only updates when countValue changes — not on every render.
    useEffect(()=>{
        localStorage.setItem('countValue',(countAnyValue))
    }, [countAnyValue])

    /* Logic of Range  */

    const messages = [
      {min:5, max:10, message:" Almost there!"},
      {min:10, max:15, message:" Great Going!"},
      {min:15, max:20, message:" Great Job!"},
      {min:20, max:30, message:" Impeccable!!!!!"},
      {max:Infinity, message:" God level!!!!!"},
    ]

    const getMessageForValue = (value) =>{
      if (value > 30) {
        return messages.find(v => v.max === Infinity).message;
      }
      const found = messages.find(range=> value >=  range.min && value < range.max)
      return found ? found.message : "";
    }

  return (
    // <div>Counter {countAnyValue} {countAnyValue===10 && '(full 10 counts)'}</div>
    // <div>Counter {countAnyValue} </div>
    <div>Counter {countAnyValue} {getMessageForValue(countAnyValue)} </div>
  )
}


/* Implement dynamic object value set on the basis of counter value
i.e,  if counter value =0 (Zero)
      if counter value >5 (greater than 5)
      if counter value > 10 (Hit the decade)
      if value exceends 15 (Hold on aditya)
*/

/* 
other application - display logout on nav if user is logged in
display toggle altered value ( eg. dark mode on/of )
*/