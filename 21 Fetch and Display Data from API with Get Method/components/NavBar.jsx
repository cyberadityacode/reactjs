import { NavLink, Route, Routes } from "react-router";
import Home from './Home'
import About from './About'
import Users from './Users'


export default function NavBar() {
  return (
    <>
    <div className="flex text-2xl [&>*]:mx-3 [&>*]:mb-3 items-center justify-evenly">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/users">Users</NavLink>
    </div>

    <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/users" element={<Users />}></Route>
    </Routes>
    </>
  )
}
