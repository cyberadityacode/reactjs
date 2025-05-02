import { useState } from "react";
import BasketOneComponent from "./BasketOneComponent";
import BasketTwoComponent from "./BasketTwoComponent";
import Button from "./button";

const AppleCounter = () => {
  const [basketOneCount, setBasketOneCount] = useState(10);
  const [basketTwoCount, setBasketTwoCount] = useState(0);


  const onClickLeft = ()=>{
    console.log('left clicked');

    if(basketTwoCount>0){
      setBasketTwoCount(basketTwoCount -1)
      setBasketOneCount(basketOneCount +1)
    }
    
  }
  const onClickRight = ()=>{
    console.log('Right clicked');

    if(basketOneCount>0){
      setBasketTwoCount(basketTwoCount +1)
      setBasketOneCount(basketOneCount -1)
    }
  }
  return (
    <div className="flex items-center w-full min-h-screen container justify-around">
      <BasketOneComponent  appleCount={basketOneCount} basketName="Basket 1" />
      <div>
        <Button onClickLeft ={onClickLeft} onClickRight = {onClickRight} disableLeft={basketTwoCount === 0}
  disableRight={basketOneCount === 0} />
      </div>
      <BasketTwoComponent appleCount={basketTwoCount} basketName="Basket 2" />
    
    </div>
  );
};
export default AppleCounter;
