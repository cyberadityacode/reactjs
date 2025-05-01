
const BasketOneComponent = (props) => {
  return (
    <div id="basket-1">
      <h2 className="text-3xl">{props.appleCount} Apples</h2>
      <p className="text-sm text-center">{props.basketName}</p>
    </div>
  );
};
export default BasketOneComponent;
