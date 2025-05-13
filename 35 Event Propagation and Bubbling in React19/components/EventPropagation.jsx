export default function EventPropagation() {

  const handleChildClick = (event)=>{
    console.log('child clicked');
    // event.stopPropagation();
    console.log(event);
  }

  const handleParentClick = (event)=>{
    console.log('Parent Clicked');
    console.log(event);
  }

  const handleGrandParentClick = (event)=>{
    console.log('Grand Parent Clicked');
    console.log(event);
  }

  return (
    <>
    <div>
      <h1 className="text-4xl">Event Propagation</h1>
    </div>

    {/* Swap onClickCapture to onClick to witness event bubbling, else enjoy event capturing */}
    <div className="grand-parent" onClickCapture={handleGrandParentClick} >
      <div className="parent" onClickCapture={handleParentClick}>
        
        <div className="child ">
          <button onClickCapture={handleChildClick} className="p-3 bg-gray-700 text-white font-bold rounded active:scale-105 " >
            Child Click
          </button>

        </div>
      </div>

    </div>
    </>
  );
}
