import React, { useEffect } from 'react'

export default function Cards({cardNumber}) {
    useEffect(()=>{
        console.log("Card Mounted: ", cardNumber);
        return ()=>{
            console.log("Card Unmounted: ", cardNumber );
        }
    },[cardNumber]);

  return (
    <div className='p-10 border w-full h-[200px] flex justify-center items-center'>Cards {cardNumber}</div>
  )
}
