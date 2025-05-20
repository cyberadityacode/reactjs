import React, { useEffect, useRef, useState } from 'react'
/*  Task 7: Store scroll position on unmount
Use a ref to store scroll position before the component unmounts.

Log it to the console. */
export function UseRefFifthComponent() {
    console.log('I am Mounted');
    const scrollPosition = useRef(0);

    useEffect(()=>{
        const handleScroll = ()=>{
            scrollPosition.current = window.scrollY;
        }
        window.addEventListener("scroll", handleScroll)
        
        //cleanup
        return ()=>{
            // On unmount log the last known scroll position
            console.log("Component Unmounted. last scroll position", scrollPosition.current);
            window.removeEventListener("scroll", handleScroll);
        }
    },[])

  return (
    <div>
        <h1>UseRef Fifth Component</h1>
        <h1>Task 7: Store scroll position on component unmount</h1>
        <div className="h-[2000px] p-5 bg-red-300 ">
            <h1>Scroll Tracker Component</h1>
            <p>Scroll down and unmount this component to log scroll position</p>
            <p className="mt-6">Scroll down to simulate long content...</p>
        </div>


    </div>
  )
}

export default function ParentComponentFifth(){
    const [show,setShow] = useState(true);


    return (
        <>
        <button className='p-2 m-3 bg-gray-500 text-white hover:bg-gray-800' onClick={()=>setShow((prev)=> !prev)}>{show ?"Unmount" :"Mount"} Scroll Tracker</button>
       
       {show && <UseRefFifthComponent />} 
        </>
    );
}