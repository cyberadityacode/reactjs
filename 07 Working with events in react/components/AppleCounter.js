import BasketOneComponent from "./BasketOneComponent";
import BasketTwoComponent from "./BasketTwoComponent";
import Button from "./button";
import React from "react";
import {createRoot} from "react-dom/client";

const root = createRoot(document.querySelector('#root'))



const totalAppleCount = 10;
let basketTwoAppleCount = 0;
let basketOneAppleCount = totalAppleCount - basketTwoAppleCount;

const AppleCounter = () => {
  const button1Click = () => {
    console.log("btn 1 clicked");
    basketOneAppleCount++;
    basketTwoAppleCount--;
  };
  const button2Click = () => {
    console.log("btn 2 clicked");
    basketOneAppleCount--;
    basketTwoAppleCount++;
  };

  return (
    <>
      <div className="flex items-center w-full min-h-screen container justify-around">
        <BasketOneComponent
          appleCount={basketOneAppleCount}
          basketName="Basket 1"
        />
        <div>
          <Button onLeftClick={button1Click} onRightClick={button2Click} />
        </div>
        <BasketTwoComponent
          appleCount={basketTwoAppleCount}
          basketName="Basket 2"
        />
      </div>
      <button
        onClick={() => {
          console.log("Re-Render Clicked");
         
           root.render(<AppleCounter />);
        }}
      >
        Re-Render
      </button>
    </>
  );
};
export default AppleCounter;
