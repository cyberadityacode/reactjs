import { lazy, Suspense, useState } from "react";
// import User from "./User";
const User = lazy(()=> import('./User'))

export default function App() {
    const [load, setLoad] =useState(false)

  return (
    <>
    <h1>Lazy Loading</h1>

    {
        load ? <Suspense fallback={<h1>loading...</h1>}><User /></Suspense> : null
    }
   
   
    <button className="bg-blue-500 text-white font-bold p-3" onClick={()=>setLoad(true)}>Load User</button>
    </>
  )
}
