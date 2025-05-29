import React from 'react'
import {NavLink} from "react-router-dom"
export default function Header() {
  return (
     <header>
        <nav>
          <div className="navigation-bar">
            <div className="logo">
              <NavLink to="/">Logo</NavLink>
            </div>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/trad">Fetch Old</NavLink>
              </li>
              <li>
                <NavLink to="/rq">React Query</NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </header>
  )
}
