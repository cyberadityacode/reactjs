import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header >
      <nav>
        <div className='navigation-bar'>
          <div className='logo'>
           <NavLink to="/"> <h1>Logo</h1></NavLink>
          </div>
          <div>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/LiveRQ">LiveRQ</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
