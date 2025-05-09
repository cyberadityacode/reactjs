import { lazy, Suspense, useState } from "react";
import User from "./User";

const fetchData = ()=> fetch('https://dummyjson.com/users').then((response)=> response.json())

const userResource = fetchData()

export default function App() {

  return (
    <>
    <h1>Call Rest API with use API</h1>
    <Suspense fallback={<h1>loading...</h1>}>
      <User userResource = {userResource} />
    </Suspense>
    
    </>
  )
}
