import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useRef } from 'react'

/* 
Task 9: Use useRef for DOM measurements
Use ref.current.getBoundingClientRect() to measure the size of a box

Show it in UI after mount
*/

export default function UseRefSeventhComponent() {
    const boxRef = useRef(null);
    const [dimensions, setDimensions] = useState(null);

    useEffect(()=>{
        const rect = boxRef.current.getBoundingClientRect();

        setDimensions({
            width: rect.width,
            height : rect.height,
            top: rect.top,
            left : rect.left,
        })
    }, [])
  return (
    <div>
        <h1>Task 9: Use useRef for DOM measurements</h1>

        <div ref={boxRef} className='bg-gray-200 w-64 h-32 flex justify-center items-center rounded shadow'>Measure Me</div>
        
        {
            dimensions && (
                <div>
                    <p>Width: {dimensions.width}</p>
                    <p>Height: {dimensions.height}</p>
                    <p>Top: {dimensions.top}</p>
                    <p>Left: {dimensions.left}</p>
                </div>
            )
        }
    </div>
  )
}
