import BasketOneComponent from "./BasketOneComponent";
import BasketTwoComponent from "./BasketTwoComponent";
import Button from "./button";

const AppleCounter = () => {
  const basketOneAppleCount = 5;
  const basketTwoAppleCount = 3;
  return (
    <div className="flex items-center w-full min-h-screen container justify-around">
      <BasketOneComponent  appleCount={basketOneAppleCount} basketName="Basket 1" />
      <div>
        <Button />
      </div>
      <BasketTwoComponent appleCount={basketTwoAppleCount} basketName="Basket 2" />
    </div>
  );
};
export default AppleCounter;
