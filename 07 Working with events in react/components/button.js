
const Button = ({onLeftClick, onRightClick}) => {
  return (
    <div id="arrows">
      <button onClick={onLeftClick}  className="mx-3 p-4 bg-blue-500 font-bold text-white rounded hover:bg-blue-700 active:scale-105">
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <button onClick={onRightClick} className="p-4 bg-green-500 font-bold text-white rounded hover:bg-green-700 active:scale-105">
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Button;
