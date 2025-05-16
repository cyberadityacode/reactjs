import { useState } from "react"

export default function ChallengeUseState() {
    const [count, setCount] = useState(0)
    const [step, setStep] = useState(1)

    const handleStepChange = (event)=>{
        // Clamping range 0 to 100 
        let newStep = Number(event.target.value)
        newStep = Math.max(0, Math.min(100, newStep))
        setStep(newStep)
    }
    const handleButtonIncrease = ()=>{
        console.log('Increase btn clicked');
        setCount((prev)=> Math.min(100, prev+step)) //clamp upper bound to 100
    }
    const handleButtonDecrease = ()=>{
        console.log('Decrease btn clicked');
        //I can use Math.min too to achieve efficient code, but its just for learning purpose.
        setCount((prev)=>{
            const newCount = prev - step
            return newCount <0 ? 0 : newCount
        })
    }

  return (
    <div className="parent-div">
        <h1 className="heading">Welcome to useState Challenge</h1>
        <h2 className="counter">Count: {count}</h2>
        <div id='input-controls'>
            <label htmlFor="steps">Steps</label>
            <input type="number" id='steps' min="0" max="100" value={step} onChange={(event)=> handleStepChange(event)} />

            <div id='btn-controls'>
                <button className="btn-increase" disabled={count >= 100} onClick={handleButtonIncrease}>Increase</button>
                <button className="btn-decrease" disabled= {count<=0} onClick={handleButtonDecrease}>Decrease</button>
                <button className="btn-reset" onClick={()=> setCount(0)} >Reset</button>
            </div>
        </div>
        <p>Limit the user on step range between 0 to 100</p>
    </div>
  )
}
