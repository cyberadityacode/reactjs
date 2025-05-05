import { Link, NavLink, Outlet } from "react-router"
import CollegeStudent from "./CollegeStudent"

export default function College() {
  return (
    <div>
        <h1 className="text-center text-3xl">College</h1>
        <h2><Link to="/">Simon Go Back to Home</Link></h2>
        <nav className=' text-2xl  [&>*]:mx-3 flex justify-center [&>*]:hover:font-bold  ' >
            <NavLink to=''>Student</NavLink>
            <NavLink to='department'>Department</NavLink>
            <NavLink to='details'>Details</NavLink>
           
        </nav>
        <Outlet />
    </div>
  )
}
