import {NavLink} from "react-router-dom";

export default function Header() {
  return (
    <header>
      <div className="container">
        <div className="grid navbar-grid">
          <div className="logo">
            <NavLink to="/">
              <h1>WorldAtlas</h1>
            </NavLink>
          </div>

          <nav>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="about">About</NavLink></li>
              <li><NavLink to="country">Country</NavLink></li>
              <li><NavLink to="contact">Contact</NavLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
