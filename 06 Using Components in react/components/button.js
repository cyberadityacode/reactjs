
const Button = ({onClickLeft ,onClickRight}) => {
  return (
    <div id="arrows">
      <button onClick={onClickLeft} className="mx-3 p-4 bg-blue-500 font-bold text-white rounded hover:bg-blue-700 active:scale-105">
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <button onClick={onClickRight} className="p-4 bg-green-500 font-bold text-white rounded hover:bg-green-700 active:scale-105">
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Button;
