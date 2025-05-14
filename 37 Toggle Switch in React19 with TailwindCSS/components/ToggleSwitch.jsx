import React, { useState } from "react";

export default function ToggleSwitch() {
    const [isOn, setIsOn] = useState(false)
    // console.log(isOn);
    const handleToggle= (e)=>{
        console.log('handle toggle');
        setIsOn(prev=> !prev);
        // console.log(isOn);
        
    }
  return (
    <>
     <div onClick={handleToggle} role="button" aria-pressed={isOn} className={`toggle-switch ${ !isOn? "bg-gray-400" : "bg-gray-800"} cursor-pointer`}>
        <div className={`switch ${isOn ? "on":"off"}`}>
            <span  className="switch-state ">{isOn ? "ON": "OFF"}</span>
        </div>
     </div>
    </>
  );
}
