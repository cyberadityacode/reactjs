import React from 'react'
/* 
Objective to pass data from PropsDrilling to GrandGrandChildComponent
*/
export default function PropsDrilling() {
  return (
    <div>
        <h1>PropsDrilling</h1>
        <ChildComponent data="Esoteric Secret Recipe " />
    </div>
  )
}

export function ChildComponent(props) {
  return (
    <div>
        <h1>Child Component</h1>
        <GrandChildComponent data ={props.data} />
    </div>
  )
}

export function GrandChildComponent(props) {
  return (
    <div>
        <h1>GrandChild Component </h1>
        <GrandGrandChildComponent data ={props.data} />
    </div>
  )
}
export function GrandGrandChildComponent(props) {
  return (
    <div>
        <h1>GrandChild Component </h1>
        <h1>Gift from Ancester : {props.data}</h1>
    </div>
  )
}

