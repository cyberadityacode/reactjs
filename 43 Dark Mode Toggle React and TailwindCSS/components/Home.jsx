import React, { use } from 'react'
import { ThemeContext } from './ToggleLightDark'

export default function Home() {
    
   const {theme, handleToggleTheme}=  use(ThemeContext)

  return (
    <div className={ theme==="dark"? "bg-gray-500 text-white" :"bg-white text-black"}>
      <div className='parent'>
        <h1>Switch Modes</h1>
        <h2>Hello aditya</h2>
        <button onClick={handleToggleTheme} className='btn-primary'>{theme!=="light"?"Switch to Light Mode":"Switch to Dark Mode"}</button>
    </div>
    </div>
  )
}
