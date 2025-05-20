import React from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useRef } from "react";
/* Task 8: Create a child component exposing a method to the parent
Use forwardRef and useImperativeHandle

Parent clicks a button to call a method in child (e.g., reset input or play animation)
 */
export default function UseRefSixthComponent() {
    const childRef =useRef();

    const handleReset =()=>{
      childRef.current.resetInput();
    }

    const handleFocus =()=>{
      childRef.current.focusInput();
    }
  return (
    <div>
      <h1>UseRefSixthComponent</h1>
      <p>Level 4- Task 8: Create a child component exposing a method to the parent</p>
      <ul>
        <li>Use forwardRef and useImperativeHandle</li>
        <li>Parent clicks a button to call a method in child (e.g., reset input or play animation)</li>
      </ul>

      <ChildOfSixthComponent ref={childRef} />

      <div className="space-x-4 mt-4">
        <button className="border p-3 m-3" onClick={handleReset}>Reset Input</button>
        <button className="border p-3 m-3" onClick={handleFocus}>Focus Input</button>
      </div>
    </div>
  );
}

const ChildOfSixthComponent = forwardRef((props, ref)=> {
  const inputRef = useRef();
  // Expose functions to parent via ref

  useImperativeHandle(ref, ()=>({
    resetInput(){
      inputRef.current.value = "";
    },

    focusInput(){
      inputRef.current.focus();
    }
  }));
  return (
    <div>
      <h1>Hello from Child Component</h1>
      <input type="text" ref={inputRef} placeholder="type sometext" className="border p-2 rounded" />
    </div>
  );
})
