
export default function EventProps() {

    const handleWelcomeUser = (user)=>{
        alert(`hey ${user}`)
    }
    const handleHover = ()=>{
        alert('thanks for hovering')
    }
  return (
    <>
        <WelcomeUser onButtonClick={()=> handleWelcomeUser('aditya')}
        onMouseEnter= {handleHover}
        />
    </>
  )
}


const WelcomeUser = (props)=>{
    const {onButtonClick, onMouseEnter} = props;
    const handleGreetings = ()=>{
        console.log('Hey User Welcome');
        // calling parent prop function
        props.onButtonClick();
    }
    return (
        <>
            <button className="p-4  bg-red-500 m-3" onClick={onButtonClick}>Click me</button>
            <button className="p-4 bg-green-500 m-3" onMouseEnter={onMouseEnter}>Hover me</button>
            <button className="p-4 bg-yellow-500 m-3" onClick={handleGreetings}>Greeting</button>
        </>
    )
}